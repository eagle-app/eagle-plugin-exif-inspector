<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const props = defineProps({
    header: {
        type: Object,
        default(rawProps) {
            return {
                name: '',
                minWidth: null,
                maxWidth: null,
                align: 'start',
                fill: false,
                line: false
            };
        },
        required: true
    },
    data: { type: Array, required: true },
    autoScrollDelay: { type: Number, default: 3 }
});

let thead = [];
Object.entries(props.header).forEach((item) => {
    const [key, value] = item;
    const width = measureText(value.name).width;
    thead.push({
        key,
        ...value,
        width: `${width}px`,
        minWidth: value.minWidth ? `${value.minWidth}px` : 'auto',
        maxWidth: value.maxWidth ? `${value.maxWidth}px` : 'auto'
    });
});

const list = computed(() => {
    const ar = [];
    for (let i = 0; i < props.data.length; i++) {
        ar.push({ id: i, data: props.data[i] });
    }
    return ar;
});

function measureText(pText) {
    let div = document.createElement('div');

    document.body.appendChild(div);

    div.style.position = 'absolute';
    div.style.left = -1000;
    div.style.top = -1000;

    div.style.fontSize = '14px';

    div.textContent = pText;

    let result = {
        width: div.clientWidth,
        height: div.clientHeight
    };

    document.body.removeChild(div);
    div = null;

    return result;
}

const scrollerEl = ref(null);
const currentDelay = ref(0);

const onWheel = () => {
    currentDelay.value = props.autoScrollDelay;
};

onMounted(() => {
    setInterval(() => {
        if (currentDelay.value > 0) currentDelay.value--;
    }, 1000);
});

const scroll = (index) => {
    const visibleLength = 3;
    if (index < visibleLength || index >= props.data.length) return;
    if (currentDelay.value <= 0) {
        scrollerEl.value.scrollToItem(index - visibleLength);
    }
};

defineExpose({
    scroll
});
</script>

<template>
    <div class="v-table">
        <div class="v-thead">
            <div class="v-tr">
                <div
                    class="v-td"
                    :class="{ fill: value.fill, line: value.line }"
                    :style="{
                        width: value.width,
                        minWidth: value.minWidth,
                        maxWidth: value.maxWidth,
                        justifyContent: 'flex-' + value.align
                    }"
                    v-for="(value, index) in thead"
                    :key="index"
                >
                    {{ value.name }}
                </div>
            </div>
        </div>

        <RecycleScroller
            class="v-tbody"
            :items="list"
            :item-size="41"
            :buffer="200"
            v-slot="{ item, index }"
            ref="scrollerEl"
            key-field="id"
            @wheel="onWheel"
        >
            <div class="v-tr" :class="{ striped: index % 2 == 1 }">
                <div
                    class="v-td"
                    :class="{
                        fill: value.fill
                    }"
                    :style="{
                        width: value.width,
                        minWidth: value.minWidth,
                        maxWidth: value.maxWidth,
                        justifyContent: 'flex-' + value.align
                    }"
                    v-for="value in thead"
                    :key="value"
                >
                    <slot :name="value.key" :row="item.data" :index="index">
                        {{ item.data[value.key] }}
                    </slot>
                </div>
            </div>
        </RecycleScroller>
    </div>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.v-table {
    @mixin tr {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        margin-bottom: 1px;
        margin: 0 4px;
        height: inherit;
    }

    @mixin td {
        display: flex;
        align-items: center;
        height: inherit;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        &.fill {
            flex: 1;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }

    width: 100%;
    height: 100%;
    min-width: 300px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .v-thead {
        display: flex;
        border-bottom: 1px solid var(--color-border-secondary);
        color: var(--color-text-tertiary);
        height: 28px;
        margin-bottom: 3px;
        .v-tr {
            @include tr;
            flex: 1;
            .v-td {
                font-size: 12px;
                @include td;
            }
        }
    }
    .v-tbody {
        flex: 1;
        height: 100%;
        overflow-y: overlay !important;
        color: var(--color-text-primary);

        .v-tr {
            @include tr;

            --background-color: transparent;
            &.striped {
                --background-color: var(--color-dark-3);
                @include mixins.dark {
                    --background-color: var(--color-lightgray-3);
                }
            }
            height: 40px;

            border-radius: 6px;
            background-color: var(--background-color);
            .v-td {
                font-size: 13px;
                @include td;
                &:empty {
                    &::before {
                        color: var(--color-text-primary);
                        content: '-';
                        opacity: 0.5;
                    }
                }
            }
            &:hover {
                --background-color: var(--color-dark-8);
                @include mixins.dark {
                    --background-color: var(--color-lightgray-8);
                }
            }
        }
    }
}
</style>
