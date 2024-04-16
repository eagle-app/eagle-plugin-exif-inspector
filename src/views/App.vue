<script setup>
import { t, useContextMenu } from '@/composables';
// import Main from '@scripts/main';

const utils = require(`${__dirname}/modules/utils`);
const { ExifInspector } = require(`${__dirname}/modules`);

const isLoading = ref(true);
const data = ref({});

onMounted(async () => {
    isLoading.value = true;
    const items = await eagle.item.getSelected();
    const item = items[0];
    data.value = await ExifInspector.getData(item.filePath);
    isLoading.value = false;
    console.log(data.value);
});
</script>

<template>
    <template v-if="isLoading">
        <div class="card">
            <div class="loading"></div>
            <!-- <div class="text">{{ t('loading') }}</div> -->
        </div>
    </template>
    <template v-else>
        <template v-if="Object.keys(data).length > 0">
            <div class="list">
                <template v-for="(value, key) in data" :key="title">
                    <ItemVue :title="key" :info="value">
                        <template #title>{{ t('exif.' + key) }}</template>
                        <template #key="slotProps">{{ t('exif.' + slotProps.text) }}</template>
                    </ItemVue>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="card">
                <!-- <div class="no-data"></div> -->
                <div class="text">{{ t('noData') }}</div>
            </div>
        </template>
    </template>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.card {
    position: relative;
    background-color: var(--color-bg-hover);
    padding: 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .loading {
        position: relative;
        width: 16px;
        height: 16px;
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

    .no-data {
        position: relative;
        width: 16px;
        height: 16px;
        &:after {
            --background-image: url('/images/light/no_data.svg');
            @include mixins.dark {
                --background-image: url('/images/dark/no_data.svg');
            }
            content: '';
            background-image: var(--background-image);
            width: inherit;
            height: inherit;
            position: absolute;
        }
    }

    .text {
        color: var(--color-text-tertiary);
        line-height: 16px;
        font-size: 11px;
    }
}
.list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
