<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { startRegistration } from '@simplewebauthn/browser';
import { NButton, NPopconfirm } from 'naive-ui';

import { useGlobalState } from '../../store';
import { api } from '../../api';

const { userJwt, userSettings } = useGlobalState();
const message = useMessage();

const showLogout = ref(false);
const showCreatePasskey = ref(false);
const passkeyName = ref('');
const showPasskeyList = ref(false);
const showRenamePasskey = ref(false);
const currentPasskeyId = ref(null);
const currentPasskeyName = ref('');

const { t } = useI18n({
  messages: {
    en: {
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      passordTip:
        'The server will only receive the hash value of the password, and will not receive the plaintext password, so it cannot view or retrieve your password. If the administrator enables email verification, you can reset the password in incognito mode',
      createPasskey: 'Create Passkey',
      showPasskeyList: 'Show Passkey List',
      passkeyCreated: 'Passkey created successfully',
      passkeyNamePlaceholder:
        'Please enter the passkey name or leave it empty to generate a random one',
      renamePasskey: 'Rename Passkey',
      deletePasskey: 'Delete Passkey',
      passkey_name: 'Passkey Name',
      created_at: 'Created At',
      updated_at: 'Updated At',
      actions: 'Actions',
      renamePasskeyNamePlaceholder: 'Please enter the new passkey name',
    },
    id: {
      logout: 'Keluar',
      logoutConfirm: 'Anda yakin ingin keluar?',
      passordTip:
        'Server hanya akan menerima nilai hash dari kata sandi, dan tidak akan menerima kata sandi dalam teks biasa, sehingga tidak dapat melihat atau mengambulkan kata sandi Anda. Jika administrator mengaktifkan verifikasi email, Anda dapat mengatur ulang kata sandi dalam mode inkognito',
      createPasskey: 'Buat Passkey',
      showPasskeyList: 'Tampilkan Daftar Passkey',
      passkeyCreated: 'Passkey berhasil dibuat',
      passkeyNamePlaceholder:
        'Silakan masukkan nama passkey atau biarkan kosong untuk menghasilkan nama acak',
      renamePasskey: 'Ganti Nama Passkey',
      deletePasskey: 'Hapus Passkey',
      passkey_name: 'Nama Passkey',
      created_at: 'Dibuat Pada',
      updated_at: 'Diperbarui Pada',
      actions: 'Aksi',
      renamePasskeyNamePlaceholder: 'Silakan masukkan nama passkey baru',
    },
  },
});

const logout = async () => {
  userJwt.value = '';
  location.reload();
};

const createPasskey = async () => {
  try {
    const options = await api.fetch(`/user_api/passkey/register_request`, {
      method: 'POST',
      body: JSON.stringify({
        domain: location.hostname,
      }),
    });
    const credential = await startRegistration({ optionsJSON: options });

    // Send the result to the server and return the promise.
    await api.fetch(`/user_api/passkey/register_response`, {
      method: 'POST',
      body: JSON.stringify({
        origin: location.origin,
        passkey_name:
          passkeyName.value ||
          (window.navigator.userAgentData?.platform || 'Unknown') +
            ': ' +
            Math.random().toString(36).substring(7),
        credential,
      }),
    });
    message.success(t('passkeyCreated'));
  } catch (e) {
    console.error(e);
    message.error(e.message);
  } finally {
    passkeyName.value = '';
    showCreatePasskey.value = false;
  }
};

const passkeyColumns = [
  {
    title: 'Passkey ID',
    key: 'passkey_id',
  },
  {
    title: t('passkey_name'),
    key: 'passkey_name',
  },
  {
    title: t('created_at'),
    key: 'created_at',
  },
  {
    title: t('updated_at'),
    key: 'updated_at',
  },
  {
    title: t('actions'),
    key: 'actions',
    render(row) {
      return h('div', [
        [
          h(
            NButton,
            {
              tertiary: true,
              type: 'primary',
              onClick: () => {
                showRenamePasskey.value = true;
                currentPasskeyId.value = row.passkey_id;
              },
            },
            { default: () => t('renamePasskey') }
          ),
          h(
            NPopconfirm,
            {
              onPositiveClick: async () => {
                try {
                  await api.fetch(`/user_api/passkey/${row.passkey_id}`, {
                    method: 'DELETE',
                  });
                  await fetchPasskeyList();
                } catch (e) {
                  console.error(e);
                  message.error(e.message);
                }
              },
            },
            {
              trigger: () =>
                h(
                  NButton,
                  {
                    tertiary: true,
                    type: 'error',
                  },
                  { default: () => t('deletePasskey') }
                ),
              default: () => `${t('deletePasskey')}?`,
            }
          ),
        ],
      ]);
    },
  },
];

const passkeyData = ref([]);

const fetchPasskeyList = async () => {
  try {
    const data = await api.fetch(`/user_api/passkey`);
    passkeyData.value = data;
  } catch (e) {
    console.error(e);
    message.error(e.message);
  }
};

const renamePasskey = async () => {
  try {
    await api.fetch(`/user_api/passkey/rename`, {
      method: 'POST',
      body: JSON.stringify({
        passkey_name: currentPasskeyName.value,
        passkey_id: currentPasskeyId.value,
      }),
    });
    await fetchPasskeyList();
  } catch (e) {
    console.error(e);
    message.error(e.message);
  } finally {
    currentPasskeyName.value = '';
    showRenamePasskey.value = false;
  }
};
</script>

<template>
  <div class="center" v-if="userSettings.user_email">
    <n-card :bordered="false" embedded>
      <n-button
        @click="
          showPasskeyList = true;
          fetchPasskeyList();
        "
        secondary
        block
        strong
      >
        {{ t('showPasskeyList') }}
      </n-button>
      <n-button @click="showCreatePasskey = true" type="primary" secondary block strong>
        {{ t('createPasskey') }}
      </n-button>
      <n-alert :show-icon="false" :bordered="false">
        <span>
          {{ t('passordTip') }}
        </span>
      </n-alert>
      <n-button @click="showLogout = true" secondary block strong>
        {{ t('logout') }}
      </n-button>
    </n-card>
    <n-modal v-model:show="showCreatePasskey" preset="dialog" :title="t('createPasskey')">
      <n-input v-model:value="passkeyName" :placeholder="t('passkeyNamePlaceholder')" />
      <template #action>
        <n-button :loading="loading" @click="createPasskey" size="small" tertiary type="primary">
          {{ t('createPasskey') }}
        </n-button>
      </template>
    </n-modal>
    <n-modal v-model:show="showRenamePasskey" preset="dialog" :title="t('renamePasskey')">
      <n-input
        v-model:value="currentPasskeyName"
        :placeholder="t('renamePasskeyNamePlaceholder')"
      />
      <template #action>
        <n-button :loading="loading" @click="renamePasskey" size="small" tertiary type="primary">
          {{ t('renamePasskey') }}
        </n-button>
      </template>
    </n-modal>
    <n-modal v-model:show="showPasskeyList" preset="card" :title="t('showPasskeyList')">
      <n-data-table :columns="passkeyColumns" :data="passkeyData" :bordered="false" embedded />
    </n-modal>
    <n-modal v-model:show="showLogout" preset="dialog" :title="t('logout')">
      <p>{{ t('logoutConfirm') }}</p>
      <template #action>
        <n-button :loading="loading" @click="logout" size="small" tertiary type="warning">
          {{ t('logout') }}
        </n-button>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
}

.n-card {
  max-width: 800px;
  text-align: left;
}

.n-button {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
