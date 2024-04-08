<script setup>
import { t, useContextMenu } from '@/composables';
// import Main from '@scripts/main';

const utils = require(`${__dirname}/modules/utils`);
const { ExifInspector } = require(`${__dirname}/modules`);

const data = ref({});

onMounted(async () => {
    const items = await eagle.item.getSelected();
    const item = items[0];
    data.value = await ExifInspector.getData(item.filePath);
});
</script>

<template>
    <ItemVue :data="data" v-if="Object.keys(data).length"></ItemVue>
    <div v-else style="font-size: 11px">{{ t('NoData') }}</div>
</template>

<style lang="scss"></style>
