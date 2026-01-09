<script setup>
import { t, useContextMenu } from '@/composables';
// import Main from '@scripts/main';

const utils = require(`${__dirname}/modules/utils`);
const { ExifInspector } = require(`${__dirname}/modules`);

const isLoading = ref(true);
const data = ref({});

// GPS 座標解析：將 DMS 格式轉換為十進位度數
const parseGPSCoordinate = (str) => {
    if (!str) return null;
    const match = str.match(/(\d+)\s*deg\s*(\d+)'\s*([\d.]+)"/);
    if (!match) return null;
    const [, deg, min, sec] = match;
    return parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
};

// 計算 GPS 座標（十進位）
const gpsCoordinates = computed(() => {
    const gpsInfo = data.value?.GPSInfo;
    if (!gpsInfo) return null;

    const lat = parseGPSCoordinate(gpsInfo.GPSLatitude);
    const lon = parseGPSCoordinate(gpsInfo.GPSLongitude);

    if (lat === null || lon === null) return null;
    return { lat, lon };
});

// 生成 OpenStreetMap 嵌入 URL
const mapEmbedUrl = computed(() => {
    if (!gpsCoordinates.value) return null;
    const { lat, lon } = gpsCoordinates.value;
    const delta = 0.005;
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
});

// 生成 OpenStreetMap 連結 URL
const mapLinkUrl = computed(() => {
    if (!gpsCoordinates.value) return null;
    const { lat, lon } = gpsCoordinates.value;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=16`;
});

// 在瀏覽器中打開地圖
const openMapInBrowser = () => {
    if (mapLinkUrl.value) {
        eagle.shell.openExternal(mapLinkUrl.value);
    }
};

onMounted(async () => {
    isLoading.value = true;
    const items = await eagle.item.getSelected();
    const item = items[0];
    data.value = await ExifInspector.getData(item.filePath);
    isLoading.value = false;
    console.log(data.value);
});
</script>

<template>
    <template v-if="isLoading">
        <div class="card">
            <div class="loading"></div>
            <!-- <div class="text">{{ t('loading') }}</div> -->
        </div>
    </template>
    <template v-else>
        <template v-if="Object.keys(data).length > 0">
            <div class="list">
                <template v-for="(value, key) in data" :key="key">
                    <ItemVue :title="key" :info="value">
                        <template #title>{{ t('exif.' + key) }}</template>
                        <template #key="slotProps">{{ t('exif.' + slotProps.text) }}</template>
                        <template #before-info="{ expanded }" v-if="key === 'GPSInfo' && mapEmbedUrl">
                            <div class="map-container" v-if="expanded">
                                <div class="map-placeholder">
                                    <div class="loading"></div>
                                </div>
                                <iframe
                                    :src="mapEmbedUrl"
                                    frameborder="0"
                                    allowfullscreen
                                ></iframe>
                            </div>
                        </template>
                        <template #after-info v-if="key === 'GPSInfo' && mapLinkUrl">
                            <div class="map-action">
                                <el-button class="map-btn" @click="openMapInBrowser">
                                    <span>{{ t('openInMap') }}</span>
                                </el-button>
                            </div>
                        </template>
                    </ItemVue>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="card">
                <!-- <div class="no-data"></div> -->
                <div class="text">{{ t('noData') }}</div>
            </div>
        </template>
    </template>
</template>

<style lang="scss">
@use '@styles/modules/mixins' as mixins;
.card {
    position: relative;
    background-color: var(--color-bg-hover);
    padding: 8px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .loading {
        position: relative;
        width: 16px;
        height: 16px;
        &:after {
            --background-image: url('/images/light/loading.svg');
            @include mixins.dark {
                --background-image: url('/images/dark/loading.svg');
            }
            content: '';
            background-image: var(--background-image);
            animation: loading 1s linear infinite;
            width: inherit;
            height: inherit;
            position: absolute;
        }
    }

    .no-data {
        position: relative;
        width: 16px;
        height: 16px;
        &:after {
            --background-image: url('/images/light/no_data.svg');
            @include mixins.dark {
                --background-image: url('/images/dark/no_data.svg');
            }
            content: '';
            background-image: var(--background-image);
            width: inherit;
            height: inherit;
            position: absolute;
        }
    }

    .text {
        color: var(--color-text-tertiary);
        line-height: 16px;
        font-size: 11px;
    }
}
.list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.map-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;

    .map-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--color-bg-hover);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 0;
    }

    iframe {
        position: absolute;
        top: -20px;
        left: -46px;
        width: calc(100% + 46px);
        height: calc(100% + 44px);
        border: none;
        z-index: 1;
    }
}

.map-action {
    margin-top: 8px;

    .map-btn {
        &,
        &:hover,
        &:active,
        &:focus {
            width: 100%;
            height: 28px !important;
            line-height: 28px !important;
            font-size: 11px;
            padding: 0 12px;
            transform: none !important;
        }
    }
}
</style>
