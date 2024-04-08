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
        default: -1
    }
});
</script>

<template>
    <ul class="item-vue">
        <li v-for="(v, k) in data" :key="v" class="row">
            <span v-for="i in index" :key="i" v-if="index > 0">&emsp;</span>
            <span class="title">{{ t('exif.' + k) }}</span>
            <ItemVue :data="v" :index="props.index + 1" v-if="typeof v === 'object'"></ItemVue>
            <span class="content" v-else>{{ v || 'undefined' }}</span>
        </li>
    </ul>
</template>

<style lang="scss">
.item-vue {
    list-style-type: none;
    padding: 0;
    font-size: 11px;
    .row {
        line-height: 18px;
        .title {
            display: inline-block;
            color: var(--color-text-primary);
            width: 88px;
            margin-right: 8px;
        }
        .content {
            color: var(--color-text-secondary);
            font-family: var(--font-family-mono);
        }
    }
}
</style>
