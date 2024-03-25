<!-- Masonry排版組件 -->
<script setup>
import MiniMasonry from 'minimasonry';

const emit = defineEmits(['loaded']);

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    width: {
        type: Number,
        default: 200
    },
    gutter: {
        type: Number,
        default: 10
    },
    scale: {
        type: Number,
        default: 1
    }
});

let masonry = null;

const items = ref([]);

watch(
    () => props.scale,
    async () => {
        await nextTick();
        if (masonry) masonry.destroy();
        masonry = new MiniMasonry({
            container: '.masonry_container',
            baseWidth: Number(props.width) * Number(props.scale),
            gutter: Number(props.gutter),
            wedge: true
        });

        masonry.layout();
    },
    {
        immediate: true
    }
);

watch(
    () => props.items,
    async () => {
        items.value = [];
        await nextTick();
        masonry.layout();
        // batch render
        const render = async (box) => {
            const once = 60;
            const data = box.splice(0, once);
            items.value.push(...data);
            await nextTick();
            masonry.layout();
            if (box.length !== 0) {
                requestAnimationFrame(() => render(box));
            } else {
                emit('loaded');
            }
        };

        const box = [...props.items];

        render(box);
    },
    {
        immediate: true,
        deep: true
    }
);
</script>

<template>
    <div class="masonry_container" tabindex="-1">
        <template v-for="(item, index) in items" :key="item">
            <div
                class="item"
                :style="{
                    height: item.height + 'px'
                }"
            >
                <!-- img要設定aspectRatio -->
                <slot :item="item" :index="index"></slot>
            </div>
        </template>
    </div>
</template>

<style lang="scss">
.masonry_container {
    position: relative;
    .item {
        position: absolute;
    }
}
</style>
