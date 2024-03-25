<script setup></script>

<template>
    <div class="footer-vue">
        <slot></slot>
        <div class="setting">
            <slot name="setting"></slot>
        </div>
        <div class="action">
            <slot name="action"></slot>
        </div>
    </div>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;

.footer-vue {
    position: relative;
    border-top: 1px solid var(--color-border-secondary);
    min-height: 60px;
    line-height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    .setting,
    .action {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .setting {
        flex: 1;
    }
}
</style>
