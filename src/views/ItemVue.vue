<script setup>
import { t, useContextMenu } from '@/composables';

const props = defineProps({
    data: {
        type: Array,
        default: [],
        required: true
    },
    index: {
        type: Number,
        default: 0
    }
});
</script>

<template>
    <ul class="item-vue">
        <li v-for="(v, k) in data" :key="v">
            <span v-for="i in index" :key="i">&emsp;</span>
            <span class="title">{{ t('exif.' + k) }}</span>
            <ItemVue :data="v" :index="props.index + 1" v-if="typeof v === 'object'"></ItemVue>
            <span class="content" v-else>: {{ v || 'undefined' }}</span>
        </li>
    </ul>
</template>

<style lang="scss">
.item-vue {
    list-style-type: none;
    padding: 0;
    font-size: 11px;
    .title {
        font-size: 11px;
        color: var(--color-text-primary);
    }
    .content {
        font-size: 11px;
        color: var(--color-text-secondary);
        font-family: var(--font-family-mono);
    }
}
</style>
