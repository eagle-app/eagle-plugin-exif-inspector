<script setup>
import { t } from '@/composables/i18n.js';

const title = eagle.plugin.manifest.name;

const closeDialog = reactive({
    visible: false,
    type: 'warning',
    ok: () => {
        window.close();
    }
});
</script>

<template>
    <div class="header-vue">
        <div class="drag">
            <img class="logo" src="/logo.png" alt="logo" />
            <span class="title">{{ title }}</span>
        </div>
        <div class="action">
            <slot></slot>
            <!-- <div class="dash"></div> -->
            <ThumbtackVue></ThumbtackVue>
            <ImageVue
                class="icon close"
                width="24"
                height="24"
                src="light/base/ic-header-close.svg"
                darkSrc="dark/base/ic-header-close.svg"
                @click="closeDialog.visible = true"
            ></ImageVue>
        </div>
    </div>

    <DialogVue v-model="closeDialog.visible" :type="closeDialog.type" @ok="closeDialog.ok">
        <template #title>{{ t('header.dialog.exit.title') }}</template>
        <template #description>{{ t('header.dialog.exit.description') }}</template>
        <template #cancel>{{ t('header.dialog.exit.cancel') }}</template>
        <template #ok>{{ t('header.dialog.exit.ok') }}</template>
    </DialogVue>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;

.header-vue {
    position: relative;
    min-height: 48px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-bottom: 1px solid var(--color-border-secondary);
    user-select: none;

    .drag {
        -webkit-app-region: drag;
        flex: 1;
        display: flex;
        gap: 8px;
        align-items: center;

        .logo {
            width: 24px;
            height: 24px;
            border-radius: 6px;
        }

        .title {
            color: var(--color-text-primary);
            font-weight: var(--font-weight-bold);
            font-size: 14px;
            line-height: 22px;
        }
    }

    .action {
        display: flex;

        .dash {
            width: 1px;
            height: 16px;
            background: var(--color-border-secondary);
            margin: auto 8px;
        }

        .close {
            margin-left: 12px;
        }
    }
}
</style>
