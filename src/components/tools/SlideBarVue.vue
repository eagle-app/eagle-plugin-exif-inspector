<!-- 滑動條組件 -->
<script setup>
import { onMounted } from 'vue';

const { throttle, debounce } = require(`${__dirname}/modules/utils/time`);
const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },
    data: {
        type: Array,
        default: Array.from({ length: 101 }, (_, index) => index),
        required: true
    },
    step: {
        type: Number
    }
});

const emit = defineEmits(['update:modelValue', 'changed']);

const min = computed(() => Number(props.data[0] ?? 0));
const max = computed(() => Number(props.data[props.data.length - 1] ?? 100));
const step = computed(() => props.step ?? (max.value - min.value) / 100 ?? 1);

const slide_bar_value = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
        emit('changed', value);
    }
});

function findClosestIndex(target) {
    let closestIndex = 0;
    let closestDifference = Math.abs(target - props.data[0]);
    for (let i = 1; i < props.data.length; i++) {
        const difference = Math.abs(target - props.data[i]);
        if (difference < closestDifference) {
            closestIndex = i;
            closestDifference = difference;
        }
    }
    return closestIndex;
}

const minus = () => {
    const index = findClosestIndex(props.modelValue);
    const value = props.data[index - 1 < 0 ? 0 : index - 1];
    slide_bar_value.value = value;
};

const plus = () => {
    const index = findClosestIndex(props.modelValue);
    const value = props.data[index + 1 > props.data.length - 1 ? props.data.length - 1 : index + 1];
    slide_bar_value.value = value;
};

defineExpose({
    minus,
    plus
});
</script>

<template>
    <div class="slide-bar-vue">
        <ImageVue
            @click="minus"
            class="icon"
            width="23"
            height="23"
            src="light/base/ic-slide-bar-minus.svg"
            darkSrc="dark/base/ic-slide-bar-minus.svg"
        ></ImageVue>
        <div class="range-wrap">
            <div class="range-progressbar">
                <div
                    class="current"
                    :style="{
                        width: ((slide_bar_value - min) / (max - min)) * 100 + '%'
                    }"
                ></div>
                <input
                    v-model="slide_bar_value"
                    type="range"
                    tabindex="-1"
                    :min="min"
                    :max="max"
                    :step="step"
                />
            </div>
        </div>
        <ImageVue
            @click="plus"
            class="icon"
            width="23"
            height="23"
            src="light/base/ic-slide-bar-plus.svg"
            darkSrc="dark/base/ic-slide-bar-plus.svg"
        ></ImageVue>
    </div>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;

.slide-bar-vue {
    display: flex;
    align-items: center;
    gap: 10px;
    .range-wrap {
        height: inherit;
        position: relative;
        --range-progressbar-color: var(--color-dark-25);
        --range-progressbar-current-color: var(--color-dark-50);

        @include mixins.dark {
            --range-progressbar-color: var(--color-lightgray-25);
            --range-progressbar-current-color: var(--color-lightgray-50);
        }
        
        .range-progressbar {
            position: relative;
            background-color: var(--range-progressbar-color);
            height: 3px;
            border-radius: 6px;
            width: 100px;

            .current {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background-color: var(--range-progressbar-current-color);
                border-radius: inherit;
            }

            input[type='range'] {
                position: absolute;
                left: -6px;
                right: -6px;
                height: 20px;
                margin-top: -9px;
                max-width: initial;
                appearance: none;
                display: block;
                background-color: transparent;
                &::-webkit-slider-runnable-track {
                    background-color: transparent;
                }
            }
        }
    }
}

input[type='range'] {

    --track-background-color: var(--color-dark-25);
    --thumb-background-color: #fff;
    --thumb-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);

    @include mixins.dark {
        --track-background-color: var(--color-lightgray-25);
        --thumb-background-color: #fff;
        --thumb-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    

    -webkit-appearance: none;
    vertical-align: middle;
    outline: none;
    border: none;
    padding: 0;
    background: none;
    max-width: 100%;
    height: 28px;

    &::-webkit-slider-runnable-track {
        height: 3px;
        border-radius: 3px;
        border: 1px solid transparent;
        background: var(--track-background-color);
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        border-radius: 50%;
        background: var(--thumb-background-color);
        box-shadow: var(--thumb-box-shadow);
        height: 13px;
        width: 13px;
        margin-top: -6px;
    }

    &::-webkit-slider-thumb:hover {
        background: var(--thumb-background-color);
    }

    &:active::-webkit-slider-thumb {
        outline: none;
    }
}
</style>
