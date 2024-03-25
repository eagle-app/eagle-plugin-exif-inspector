<script setup></script>

<template>
    <div class="body-vue">
        <slot></slot>
    </div>
</template>

<style lang="scss">
.body-vue {
    position: relative;
    height: 100%;
    overflow-y: overlay;
}
</style>
