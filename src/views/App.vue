<script setup>
import { t, useContextMenu } from '@/composables';
// import Main from '@scripts/main';

const utils = require(`${__dirname}/modules/utils`);
const { ExifInspector } = require(`${__dirname}/modules`);

const data = ref(null);

onMounted(async () => {
    const items = await eagle.item.getSelected();
    const item = items[0];
    data.value = await ExifInspector.getData(item.filePath);
});
</script>

<template>
    <ItemVue :data="data"></ItemVue>
</template>

<style lang="scss"></style>
