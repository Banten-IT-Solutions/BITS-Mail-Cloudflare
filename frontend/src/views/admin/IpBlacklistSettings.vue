<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'

import { useGlobalState } from '../../store'
import { api } from '../../api'

const { loading } = useGlobalState()
const message = useMessage()

const { t } = useI18n({
    messages: {
        en: {
            title: 'IP Blacklist Settings',
            manualInputPrompt: 'Type pattern and press Enter to add',
            save: 'Save',
            successTip: 'Save Success',
            enable_ip_blacklist: 'Enable IP Blacklist',
            enable_tip: 'Block IPs matching blacklist patterns from accessing rate-limited APIs',
            enable_ip_whitelist: 'Enable IP Whitelist (Strict)',
            enable_whitelist_tip: 'Strict mode: ONLY IPs matching the whitelist can access rate-limited APIs. All other IPs will be denied.',
            ip_whitelist: 'IP Whitelist Patterns',
            ip_whitelist_placeholder: 'Exact IP (e.g., 1.2.3.4) or anchored regex (e.g., ^192\\.168\\.1\\.\\d+$)',
            tip_whitelist: 'IP Whitelist: Strict allowlist — plain entries must be EXACT IP matches (no substring). Use anchored regex (^...$) for ranges. Whitelisted IPs skip blacklist checks.',
            whitelist_empty_warning: 'IP whitelist is enabled but the list is empty. This is ignored by the server to prevent lockout. Please add at least one entry before enabling.',
            ip_blacklist: 'IP Blacklist Patterns',
            ip_blacklist_placeholder: 'Enter pattern (e.g., 192.168.1 or ^10\\.0\\.0\\.5$)',
            asn_blacklist: 'ASN Organization Blacklist',
            asn_blacklist_placeholder: 'Enter ASN organization (e.g., Google, Amazon)',
            fingerprint_blacklist: 'Browser Fingerprint Blacklist',
            fingerprint_blacklist_placeholder: 'Enter fingerprint ID (e.g., a1b2c3d4e5f6g7h8)',
            tip_ip: 'IP Blacklist: Supports text matching (e.g., "192.168.1") or regex (e.g., "^10\\.0\\.0\\.5$").',
            tip_asn: 'ASN Organization: Block by ISP/provider. Case-insensitive text matching or regex.',
            tip_fingerprint: 'Browser Fingerprint: Block by browser fingerprint. Supports exact matching or regex patterns.',
            tip_daily_limit: 'Daily Limit: Restrict the maximum number of requests per IP address per day (1-1000000).',
            tip_scope: 'Applies to: Create Address, Send Mail, External Send Mail API, User Registration, Verify Code',
            enable_daily_limit: 'Enable Daily Request Limit',
            enable_daily_limit_tip: 'Limit the number of API requests per IP address per day',
            daily_request_limit: 'Daily Request Limit',
            daily_request_limit_placeholder: 'Enter limit (e.g., 1000)',
        },
        id: {
            title: 'Pengaturan Daftar Hitam IP',
            manualInputPrompt: 'Ketik pola lalu tekan Enter untuk menambah',
            save: 'Simpan',
            successTip: 'Berhasil disimpan',
            enable_ip_blacklist: 'Aktifkan Daftar Hitam IP',
            enable_tip: 'Blokir IP yang cocok dengan pola daftar hitam dari API yang dibatasi',
            enable_ip_whitelist: 'Aktifkan Daftar Putih IP (Ketat)',
            enable_whitelist_tip: 'Mode ketat: HANYA IP yang cocok dengan daftar putih yang dapat mengakses API yang dibatasi. Semua IP lain akan ditolak.',
            ip_whitelist: 'Pola Daftar Putih IP',
            ip_whitelist_placeholder: 'IP tepat (mis. 1.2.3.4) atau regex berjangkar (mis. ^192\\.168\\.1\\.\\d+$)',
            tip_whitelist: 'Daftar Putih IP: allowlist ketat — entri biasa harus cocok dengan IP yang SAMA PERSIS (bukan substring). Gunakan regex berjangkar (^...$) untuk rentang. IP yang ada di daftar putih akan melewati pemeriksaan daftar hitam.',
            whitelist_empty_warning: 'Daftar putih IP aktif tetapi daftarnya kosong. Ini diabaikan oleh server untuk mencegah terkunci. Tambahkan setidaknya satu entri sebelum mengaktifkannya.',
            ip_blacklist: 'Pola Daftar Hitam IP',
            ip_blacklist_placeholder: 'Masukkan pola (mis. 192.168.1 atau ^10\\.0\\.0\\.5$)',
            asn_blacklist: 'Daftar Hitam Organisasi ASN',
            asn_blacklist_placeholder: 'Masukkan organisasi ASN (mis. Google, Amazon)',
            fingerprint_blacklist: 'Daftar Hitam Browser Fingerprint',
            fingerprint_blacklist_placeholder: 'Masukkan ID fingerprint (mis. a1b2c3d4e5f6g7h8)',
            tip_ip: 'Daftar Hitam IP: Mendukung pencocokan teks (mis. "192.168.1") atau regex (mis. "^10\\.0\\.0\\.5$").',
            tip_asn: 'Organisasi ASN: Blokir berdasarkan ISP/provider. Pencocokan teks tidak peka huruf besar/kecil atau regex.',
            tip_fingerprint: 'Browser Fingerprint: Blokir berdasarkan fingerprint browser. Mendukung pencocokan tepat atau pola regex.',
            tip_daily_limit: 'Batas Harian: Batasi jumlah maksimum request per alamat IP per hari (1-1000000).',
            tip_scope: 'Berlaku untuk: Buat Alamat, Kirim Email, API Kirim Email Eksternal, Registrasi Pengguna, Verifikasi Kode',
            enable_daily_limit: 'Aktifkan Batas Permintaan Harian',
            enable_daily_limit_tip: 'Batasi jumlah request API per alamat IP per hari',
            daily_request_limit: 'Batas Permintaan Harian',
            daily_request_limit_placeholder: 'Masukkan batas (mis. 1000)',
        },
    }
});

const enabled = ref(false)
const ipBlacklist = ref([])
const asnBlacklist = ref([])
const fingerprintBlacklist = ref([])
const enableWhitelist = ref(false)
const ipWhitelist = ref([])
const enableDailyLimit = ref(false)
const dailyRequestLimit = ref(1000)

const fetchData = async () => {
    try {
        loading.value = true
        const res = await api.fetch(`/admin/ip_blacklist/settings`)
        enabled.value = res.enabled || false
        ipBlacklist.value = res.blacklist || []
        asnBlacklist.value = res.asnBlacklist || []
        fingerprintBlacklist.value = res.fingerprintBlacklist || []
        enableWhitelist.value = res.enableWhitelist || false
        ipWhitelist.value = res.whitelist || []
        enableDailyLimit.value = res.enableDailyLimit || false
        dailyRequestLimit.value = res.dailyRequestLimit || 1000
    } catch (error) {
        message.error(error.message || "error");
    } finally {
        loading.value = false
    }
}

const save = async () => {
    if (enableWhitelist.value && (!ipWhitelist.value || ipWhitelist.value.length === 0)) {
        message.warning(t('whitelist_empty_warning'))
        return
    }
    try {
        loading.value = true
        await api.fetch(`/admin/ip_blacklist/settings`, {
            method: 'POST',
            body: JSON.stringify({
                enabled: enabled.value,
                blacklist: ipBlacklist.value || [],
                asnBlacklist: asnBlacklist.value || [],
                fingerprintBlacklist: fingerprintBlacklist.value || [],
                enableWhitelist: enableWhitelist.value,
                whitelist: ipWhitelist.value || [],
                enableDailyLimit: enableDailyLimit.value,
                dailyRequestLimit: dailyRequestLimit.value
            })
        })
        message.success(t('successTip'))
    } catch (error) {
        message.error(error.message || "error");
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await fetchData();
})
</script>

<template>
    <div class="center">
        <n-card :title="t('title')" :bordered="false" embedded style="max-width: 800px;">
            <template #header-extra>
                <n-button @click="save" type="primary" :loading="loading">
                    {{ t('save') }}
                </n-button>
            </template>

            <n-space vertical :size="20">
                <n-alert :show-icon="false" :bordered="false" type="info">
                    <div style="line-height: 1.8;">
                        <div><strong>{{ t("tip_scope") }}</strong></div>
                        <div>• {{ t("tip_whitelist") }}</div>
                        <div>• {{ t("tip_ip") }}</div>
                        <div>• {{ t("tip_asn") }}</div>
                        <div>• {{ t("tip_fingerprint") }}</div>
                        <div>• {{ t("tip_daily_limit") }}</div>
                    </div>
                </n-alert>

                <n-form-item-row :label="t('enable_ip_whitelist')">
                    <n-switch v-model:value="enableWhitelist" :round="false" />
                    <n-text depth="3" style="margin-left: 10px; font-size: 12px;">
                        {{ t('enable_whitelist_tip') }}
                    </n-text>
                </n-form-item-row>

                <n-form-item-row :label="t('ip_whitelist')">
                    <n-select
                        v-model:value="ipWhitelist"
                        filterable
                        multiple
                        tag
                        :placeholder="t('ip_whitelist_placeholder')"
                        :disabled="!enableWhitelist">
                        <template #empty>
                            <n-text depth="3">
                                {{ t('manualInputPrompt') }}
                            </n-text>
                        </template>
                    </n-select>
                </n-form-item-row>

                <n-divider />

                <n-form-item-row :label="t('enable_ip_blacklist')">
                    <n-switch v-model:value="enabled" :round="false" />
                    <n-text depth="3" style="margin-left: 10px; font-size: 12px;">
                        {{ t('enable_tip') }}
                    </n-text>
                </n-form-item-row>

                <n-form-item-row :label="t('ip_blacklist')">
                    <n-select
                        v-model:value="ipBlacklist"
                        filterable
                        multiple
                        tag
                        :placeholder="t('ip_blacklist_placeholder')"
                        :disabled="!enabled">
                        <template #empty>
                            <n-text depth="3">
                                {{ t('manualInputPrompt') }}
                            </n-text>
                        </template>
                    </n-select>
                </n-form-item-row>

                <n-form-item-row :label="t('asn_blacklist')">
                    <n-select
                        v-model:value="asnBlacklist"
                        filterable
                        multiple
                        tag
                        :placeholder="t('asn_blacklist_placeholder')"
                        :disabled="!enabled">
                        <template #empty>
                            <n-text depth="3">
                                {{ t('manualInputPrompt') }}
                            </n-text>
                        </template>
                    </n-select>
                </n-form-item-row>

                <n-form-item-row :label="t('fingerprint_blacklist')">
                    <n-select
                        v-model:value="fingerprintBlacklist"
                        filterable
                        multiple
                        tag
                        :placeholder="t('fingerprint_blacklist_placeholder')"
                        :disabled="!enabled">
                        <template #empty>
                            <n-text depth="3">
                                {{ t('manualInputPrompt') }}
                            </n-text>
                        </template>
                    </n-select>
                </n-form-item-row>

                <n-divider />

                <n-form-item-row :label="t('enable_daily_limit')">
                    <n-switch v-model:value="enableDailyLimit" :round="false" />
                    <n-text depth="3" style="margin-left: 10px; font-size: 12px;">
                        {{ t('enable_daily_limit_tip') }}
                    </n-text>
                </n-form-item-row>

                <n-form-item-row :label="t('daily_request_limit')">
                    <n-input-number
                        v-model:value="dailyRequestLimit"
                        :min="1"
                        :max="1000000"
                        :placeholder="t('daily_request_limit_placeholder')"
                        :disabled="!enableDailyLimit"
                        style="width: 100%;"
                    />
                </n-form-item-row>
            </n-space>
        </n-card>
    </div>
</template>

<style scoped>
.center {
    display: flex;
    text-align: left;
    place-items: center;
    justify-content: center;
    margin: 20px;
}
</style>
