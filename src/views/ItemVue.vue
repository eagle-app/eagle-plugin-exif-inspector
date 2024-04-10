<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: 'test'
    },
    info: {
        type: Object,
        default: () => ({})
    }
});

const is_collapsed = ref(false);

const collapse = () => {
    is_collapsed.value = !is_collapsed.value;
    localStorage.setItem(
        `${eagle.plugin.manifest.id}.${props.title}.is_collapsed`,
        is_collapsed.value
    );
};

onMounted(() => {
    is_collapsed.value =
        localStorage.getItem(`${eagle.plugin.manifest.id}.${props.title}.is_collapsed`) ===
            'true' ?? false;
});
</script>

<template>
    <div
        :class="[
            'item-vue',
            {
                collapsed: !is_collapsed
            }
        ]"
    >
        <div class="titlebar" @click="collapse">
            <div class="name">
                <slot name="title">{{ props.title }}</slot>
            </div>
            <div class="collapse-btn"></div>
        </div>
        <div class="info">
            <div style="height: 8px" v-if="Object.keys(props.info).length !== 0"></div>
            <div class="row" v-for="(v, k) in props.info" :key="v">
                <div class="title">
                    <slot name="key" :text="k">{{ k }}</slot>
                </div>
                <div class="content">{{ v }}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.item-vue {
    background-color: var(--color-bg-hover);
    border-radius: 4px;
    padding: 8px;
    font-size: 11px;
    &:hover {
        .titlebar {
            .collapse-btn {
                opacity: 1;
            }
        }
    }
    .titlebar {
        display: flex;
        align-items: center;
        gap: 8px;
        .name {
            flex: 1;
            color: var(--color-text-tertiary);
            font-weight: var(--font-weight-bold);
            user-select: none;
        }
        .collapse-btn {
            opacity: 0;
            width: 18px;
            height: 18px;
            border-radius: 4px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 200ms ease-in-out;
            &:after {
                --background-image: url('/images/light/arrow.svg');
                @include mixins.dark {
                    --background-image: url('/images/dark/arrow.svg');
                }
                content: '';
                position: absolute;
                background-image: var(--background-image);
                width: 8px;
                height: 4px;
                opacity: 0.5;
                transform: rotate(0deg);
                transition: transform 200ms ease-in-out;
            }
            &:hover {
                background-color: var(--color-bg-hover);
            }
            &:active {
                background-color: var(--color-bg-active);
            }
            &:focus {
                background-color: var(--color-bg-selected);
            }
            &:hover,
            &:active,
            &:focus {
                &:after {
                    opacity: 1 !important;
                }
            }
        }
    }
    .info {
        overflow: hidden;
        max-height: 0;
        transition: max-height 200ms ease-in-out;
        .row {
            margin-bottom: 2px;
            display: flex;
            gap: 8px;
            line-height: 18px;
            .title {
                width: 80px;
                color: var(--color-text-primary);
            }
            .content {
                flex: 1;
                font-family: var(--font-family-mono);
                color: var(--color-text-secondary);
            }
        }
    }
    &.collapsed {
        .titlebar {
            .collapse-btn {
                &:after {
                    transform: rotate(180deg);
                }
            }
        }
        .info {
            overflow: overlay;
            max-height: 5000px;
        }
    }
}
</style>
