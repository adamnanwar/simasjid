<template>
    <div
        class="-mt-10 grid w-full gap-10 rounded-xl border border-gray-100 bg-white p-10 shadow-md lg:-mt-32 lg:grid-cols-3"
    >
        <div class="flex flex-col gap-5">
            <button
                class="border:shadow-lg btn inline-flex justify-between bg-white transition-all hover:border-2 hover:border-primary hover:bg-white hover:shadow-lg"
                :class="{ '!border-2 !border-primary !text-primary': selectedTab === 'zakat' }"
                @click="selectedTab = 'zakat'"
            >
                <div class="my-auto inline-flex gap-1">
                    <DotLottieVue
                        class="-ml-5 w-20"
                        loop
                        autoplay
                        src="/assets/anim/zakat.json"
                    />
                    <span class="my-auto -ml-3">Zakat</span>
                </div>
                <span class="text-lg">&rsaquo;</span>
            </button>

            <button
                class="border:shadow-lg btn inline-flex justify-between bg-white transition-all hover:border-2 hover:border-primary hover:bg-white hover:shadow-lg"
                :class="{ '!border-2 !border-primary !text-primary': selectedTab === 'infaq' }"
                @click="selectedTab = 'infaq'"
            >
                <div class="my-auto inline-flex gap-1">
                    <DotLottieVue
                        class="-ml-5 w-20"
                        loop
                        autoplay
                        src="/assets/anim/infaq.json"
                    />
                    <span class="my-auto -ml-3">Infaq</span>
                </div>
                <span class="text-lg">&rsaquo;</span>
            </button>

            <button
                class="border:shadow-lg btn inline-flex justify-between bg-white transition-all hover:border-2 hover:border-primary hover:bg-white hover:shadow-lg"
                :class="{ '!border-2 !border-primary !text-primary': selectedTab === 'wakaf' }"
                @click="selectedTab = 'wakaf'"
            >
                <div class="my-auto inline-flex gap-1">
                    <DotLottieVue
                        class="-ml-5 w-20"
                        loop
                        autoplay
                        src="/assets/anim/wakaf.json"
                    />
                    <span class="my-auto -ml-3">Wakaf</span>
                </div>
                <span class="text-lg">&rsaquo;</span>
            </button>
        </div>

        <div class="flex flex-col gap-2">
            <template v-if="selectedTab === 'zakat'">
                <h2 class="text-2xl font-bold">Ayo Hitung Zakat Kamu!</h2>
                <h3 class="text-md">Donasi mu sangat berarti untuk orang yang membutuhkan.</h3>
                <Zakat
                    :noBanner="true"
                    :noHeading="true"
                />
            </template>
            <template v-else-if="selectedTab === 'infaq'">
                <h2 class="text-2xl font-bold">Ayo Mulai Infaq!</h2>
                <h3 class="text-md">Silakan isi jumlah infakmu. Insya Allah berkah.</h3>
                <Infaq
                    :noBanner="true"
                    :noHeading="true"
                />
            </template>
            <template v-else-if="selectedTab === 'wakaf'">
                <h2 class="text-2xl font-bold">Ayo Mulai Wakaf!</h2>
                <h3 class="text-md">Mari wakaf tunai bersama kami!</h3>
                <Wakaf
                    :noBanner="true"
                    :noHeading="true"
                />
            </template>
        </div>
        <div class="h-full w-full overflow-hidden">
            <DotLottieVue
                :key="selectedTab"
                class="h-auto w-full object-contain"
                loop
                autoplay
                :src="`/assets/anim/${selectedTab}.json`"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

import Infaq from '@/components/sections/ziswaf/Infaq.vue'
import Wakaf from '@/components/sections/ziswaf/Wakaf.vue'
import Zakat from '@/components/sections/ziswaf/Zakat.vue'

const selectedTab = ref('zakat')
</script>
