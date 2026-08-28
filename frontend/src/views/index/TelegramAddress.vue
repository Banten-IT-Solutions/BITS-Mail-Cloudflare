<script setup lang="ts">
import { ref, h, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { NPopconfirm, NButton } from 'naive-ui';

// @ts-ignore
import { useGlobalState } from '../../store';
// @ts-ignore
import { api } from '../../api';
// @ts-ignore
import Login from '../common/Login.vue';

const { jwt, telegramApp } = useGlobalState();
// @ts-ignore
const message = useMessage();

const { t } = useI18n({
  messages: {
    en: {
      success: 'success',
      address: 'Address',
      actions: 'Actions',
      changeMailAddress: 'Change Mail Address',
      unbindMailAddress: 'Unbind Mail Address',
      bind: 'Bind',
      bindAddressSuccess: 'Bind Address Success',
    },
    id: {
      success: 'berhasil',
      address: 'Alamat',
      actions: 'Aksi',
      changeMailAddress: 'Ubah Alamat Email',
      unbindMailAddress: 'Lepas Katokan Alamat Email',
      bind: 'Ikat',
      bindAddressSuccess: 'Pengikatan Alamat Berhasil',
    },
  },
});

const data = ref([]);

const fetchData = async () => {
  try {
    data.value = await api.fetch(`/telegram/get_bind_address`, {
      method: 'POST',
      body: JSON.stringify({
        initData: telegramApp.value.initData,
      }),
    });
  } catch (error) {
    message.error((error as Error).message || 'error');
  }
};

const newAddressPath = async (
  address_name: string,
  domain: string,
  cf_token: string,
  enableRandomSubdomain: boolean
) => {
  return await api.fetch('/telegram/new_address', {
    method: 'POST',
    body: JSON.stringify({
      initData: telegramApp.value.initData,
      address: `${address_name}@${domain}`,
      cf_token: cf_token,
      enableRandomSubdomain,
    }),
  });
};

const bindAddress = async () => {
  try {
    await api.fetch(`/telegram/bind_address`, {
      method: 'POST',
      body: JSON.stringify({
        initData: telegramApp.value.initData,
        jwt: jwt.value,
      }),
    });
    message.success(t('bindAddressSuccess'));
  } catch (error) {
    message.error((error as Error).message || 'error');
  }
};

const columns = [
  {
    title: t('address'),
    key: 'address',
  },
  {
    title: t('actions'),
    key: 'actions',
    render(row: any) {
      return h('div', [
        h(
          NPopconfirm,
          {
            onPositiveClick: () => {
              jwt.value = row.jwt;
              location.reload();
            },
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  tertiary: true,
                  type: 'primary',
                },
                { default: () => t('changeMailAddress') }
              ),
            default: () => `${t('changeMailAddress')}?`,
          }
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => {
              api.fetch(`/telegram/unbind_address`, {
                method: 'POST',
                body: JSON.stringify({
                  initData: telegramApp.value.initData,
                  address: row.address,
                }),
              });
              jwt.value = '';
              location.reload();
            },
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  tertiary: true,
                  type: 'warning',
                },
                { default: () => t('unbindMailAddress') }
              ),
            default: () => `${t('unbindMailAddress')}?`,
          }
        ),
      ]);
    },
  },
];

onMounted(async () => {
  if (!telegramApp.value?.initData || data.value.length > 0) {
    return;
  }
  await fetchData();
});
</script>

<template>
  <div>
    <n-tabs type="segment">
      <n-tab-pane name="address" :tab="t('address')">
        <n-data-table :columns="columns" :data="data" :bordered="false" embedded />
      </n-tab-pane>
      <n-tab-pane name="bind" :tab="t('bind')">
        <Login :newAddressPath="newAddressPath" :bindUserAddress="bindAddress" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
