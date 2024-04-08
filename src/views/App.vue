<script setup>
import { t, useContextMenu } from '@/composables';
// import Main from '@scripts/main';

const utils = require(`${__dirname}/modules/utils`);
const { ExifInspector } = require(`${__dirname}/modules`);

const isLoading = ref(false);
const data = ref({});

onMounted(async () => {
    isLoading.value = true;
    const items = await eagle.item.getSelected();
    const item = items[0];
    data.value = await ExifInspector.getData(item.filePath);
    isLoading.value = false;
});
</script>

<template>
    <template v-if="isLoading">
        <span class="loading"></span>
    </template>
    <template v-else>
        <ItemVue :data="data" v-if="Object.keys(data).length"></ItemVue>
        <div v-else style="font-size: 11px">{{ t('NoData') }}</div>
    </template>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    transform: translate(-50%, -50%);
    &:after {
        --background-image: url('/images/light/loading.svg');
        @include mixins.dark {
            --background-image: url('/images/dark/loading.svg');
        }
        content: '';
        background-image: var(--background-image);
        animation: loading 1s linear infinite;
        width: inherit;
        height: inherit;
        position: absolute;
    }
}
</style>
