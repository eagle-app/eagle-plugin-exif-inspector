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
            <span>{{ t('exif.' + k) }}</span>
            <ItemVue :data="v" :index="props.index + 1" v-if="typeof v === 'object'"></ItemVue>
            <span v-else>: {{ v }}</span>
        </li>
    </ul>
</template>

<style lang="scss">
.item-vue {
    list-style-type: none;
    padding: 0;
}
</style>
