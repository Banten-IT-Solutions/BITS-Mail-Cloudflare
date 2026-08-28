<script setup>
import { useI18n } from 'vue-i18n';

import { useIsMobile } from '../../utils/composables';
import { useGlobalState } from '../../store';
const props = defineProps({
  showUseSimpleIndex: {
    type: Boolean,
    default: false,
  },
});

const {
  mailboxSplitSize,
  useIframeShowMail,
  preferShowTextMail,
  configAutoRefreshInterval,
  globalTabplacement,
  useSideMargin,
  useUTCDate,
  useSimpleIndex,
} = useGlobalState();
const isMobile = useIsMobile();

const { t } = useI18n({
  messages: {
    en: {
      useSimpleIndex: 'Use Simple Index',
      mailboxSplitSize: 'Mailbox Split Size',
      useIframeShowMail: 'Use iframe Show HTML Mail',
      preferShowTextMail: 'Display text Mail by default',
      useSideMargin: 'Turn on the side margins on the left and right sides of the page',
      globalTabplacement: 'Global Tab Placement',
      left: 'left',
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      useUTCDate: 'Use UTC Date',
      autoRefreshInterval: 'Auto Refresh Interval(Sec)',
    },
    id: {
      useSimpleIndex: 'Gunakan Indeks Sederhana',
      mailboxSplitSize: 'Ukuran Pembagian Kotak Surat',
      useIframeShowMail: 'Gunakan iframe untuk Menampilkan Mail HTML',
      preferShowTextMail: 'Tampilkan Mail teks secara default',
      useSideMargin: 'Aktifkan margin samping di sisi kiri dan kanan halaman',
      globalTabplacement: 'Penempatan Tab Global',
      left: 'kiri',
      top: 'atas',
      right: 'kanan',
      bottom: 'bawah',
      useUTCDate: 'Gunakan Tanggal UTC',
      autoRefreshInterval: 'Interval Refresh Otomatis(detik)',
    },
  },
});
</script>

<template>
  <div class="center">
    <n-card :bordered="false" embedded>
      <n-form-item-row v-if="!isMobile" :label="t('mailboxSplitSize')">
        <n-slider
          v-model:value="mailboxSplitSize"
          :min="0.25"
          :max="0.75"
          :step="0.01"
          :marks="{
            0.25: '0.25',
            0.5: '0.5',
            0.75: '0.75',
          }"
        />
      </n-form-item-row>
      <n-form-item-row :label="t('autoRefreshInterval')">
        <n-slider
          v-model:value="configAutoRefreshInterval"
          :min="30"
          :max="300"
          :step="1"
          :marks="{
            60: '60',
            120: '120',
            180: '180',
            240: '240',
          }"
        />
      </n-form-item-row>
      <n-form-item-row v-if="props.showUseSimpleIndex" :label="t('useSimpleIndex')">
        <n-switch v-model:value="useSimpleIndex" :round="false" />
      </n-form-item-row>
      <n-form-item-row :label="t('preferShowTextMail')">
        <n-switch v-model:value="preferShowTextMail" :round="false" />
      </n-form-item-row>
      <n-form-item-row :label="t('useIframeShowMail')">
        <n-switch v-model:value="useIframeShowMail" :round="false" />
      </n-form-item-row>
      <n-form-item-row :label="t('useUTCDate')">
        <n-switch v-model:value="useUTCDate" :round="false" />
      </n-form-item-row>
      <n-form-item-row v-if="!isMobile" :label="t('useSideMargin')">
        <n-switch v-model:value="useSideMargin" :round="false" />
      </n-form-item-row>
      <n-form-item-row :label="t('globalTabplacement')">
        <n-radio-group v-model:value="globalTabplacement">
          <n-radio-button value="top" :label="t('top')" />
          <n-radio-button value="left" :label="t('left')" />
          <n-radio-button value="right" :label="t('right')" />
          <n-radio-button value="bottom" :label="t('bottom')" />
        </n-radio-group>
      </n-form-item-row>
    </n-card>
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
</style>
