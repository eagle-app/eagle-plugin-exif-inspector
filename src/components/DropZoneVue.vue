<!-- 拖拉上傳組件 -->
<script setup>
import { t } from '@/composables/i18n.js';

const props = defineProps({
    style: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['drop']);

const active = ref(false);

const onDrop = (e) => {
    setInactive();
    const files = [...e.dataTransfer.files];
    emit('drop', files);
};

function setActive() {
    active.value = true;
}
function setInactive() {
    active.value = false;
}

const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

function preventDefaults(e) {
    e.preventDefault();
}

onMounted(() => {
    events.forEach((eventName) => {
        document.body.addEventListener(eventName, preventDefaults);
    });
});

onUnmounted(() => {
    events.forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults);
    });
});
</script>

<template>
    <div
        class="drop-zone-vue"
        :class="{
            dropping: active,
            'no-style': !props.style
        }"
        @dragenter.prevent.stop="setActive"
    >
        <slot></slot>

        <div class="overlay" @dragleave.prevent.stop="setInactive" @drop.prevent.stop="onDrop">
            <div class="tip">
                <ImageVue
                    width="16"
                    height="16"
                    src="normal/base/ic-drop-zone-download.svg"
                ></ImageVue>
                {{ t('component.dropZone.tip') }}
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.drop-zone-vue {
    display: inherit;
    justify-content: inherit;
    align-items: inherit;
    flex-direction: inherit;
    position: inherit;
    width: inherit;
    height: inherit;
    border-radius: 0 0 8px 8px;
    flex: 1;
    overflow: hidden;

    .overlay {
        z-index: 999;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--color-primary-20);
        pointer-events: none;
        opacity: 0;
        border: 2px solid var(--color-primary);
        border-radius: inherit;

        .tip {
            left: 50%;
            bottom: 12px;
            height: 36px;
            line-height: 36px;
            font-size: 13px;
            position: absolute;
            gap: 4px;
            padding: 0 12px;
            display: flex;
            transform: translate(-50%, -50%);
            color: var(--color-white);
            background: var(--color-primary);
            animation: drop-tip 0.8s infinite;
            pointer-events: none;
            border-radius: 6px;
            border: 1px solid var(--color-white-15);
        }
    }

    &.dropping {
        .overlay {
            opacity: 1;
            pointer-events: all;
        }
    }

    &.no-style {
        .overlay {
            opacity: 0;
        }
    }

    @keyframes drop-tip {
        0% {
            transform: translateX(-50%) translateY(0);
        }
        40% {
            transform: translateX(-50%) translateY(-10px);
        }
        100% {
            transform: translateX(-50%) translateY(0%);
        }
    }
}
</style>
