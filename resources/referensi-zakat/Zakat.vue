<template>
    <div class="space-y-5">
        <!-- Hero Section -->
        <img
            v-show="!noBanner"
            src="/assets/img/zakat-hero.png"
            class="min-w-full object-cover"
        />
        <div
            v-show="!noHeading"
            class="inline-flex gap-3"
        >
            <LottiePlayer
                autoplay
                loop
                src="/assets/anim/bintang.json"
                class="-mx-5 w-[75px] lg:-mx-12 lg:w-[150px]"
            />
            <div class="flex flex-col">
                <h1 class="my-auto text-xl font-bold lg:text-4xl">Ayo Hitung Zakat Kamu!</h1>
                <h2 class="text-md text-gray-500">
                    Silakan isi jumlah infakmu. Insya Allah berkah.
                </h2>
            </div>
        </div>

        <!-- Form Section -->
        <form
            class="space-y-5"
            @submit.prevent="continuePayment"
        >
            <SelectField
                id="zakat"
                label="Pilih Jenis Zakat"
                v-model="form.zakat"
                :options="zakatOptions"
                :required="true"
                @update:model-value="adjustFields"
            />
            <CheckboxField
                v-if="form.zakat"
                id="followedOrganisation"
                type="toggle"
                :label="`Saya mengetahui jumlah ${form.zakat} saya, Saya ingin isi sendiri`"
                label_position="after"
                v-model:checked="form.isi_sendiri"
            />
            <TextField
                v-if="form.isi_sendiri"
                id="total"
                :label="`Jumlah ${form.zakat}`"
                :placeholder="`Masukkan Jumlah ${form.zakat} Anda`"
                type="rupiah"
                :required="true"
                v-model="form.jumlah"
            />
            <!-- Dynamic Fields -->
            <div
                v-else
                v-for="field in dynamicFields"
                :key="field.id"
                class="my-4"
            >
                <TextField
                    :id="field.id"
                    :label="field.label"
                    :placeholder="field.placeholder"
                    :type="field.type"
                    :required="field.required"
                    v-model="form[field.id]"
                />
            </div>
            <div class="space-y-5">
                <h4 class="text-md font-bold">Total {{ form.zakat }} yang harus dibayar</h4>
                <h5 class="inline-flex gap-1 text-xl font-bold text-primary">
                    <span class="mt-auto">Rp</span>
                    <Counter
                        :key="calculateZakat"
                        :number="calculateZakat"
                    ></Counter>
                </h5>
            </div>
            <button
                class="btn btn-primary w-full"
                type="submit"
                :disabled="isSubmitDisabled"
            >
                Bayar Zakat
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import Counter from '@/components/core/Counter.vue'
import CheckboxField from '@/components/core/forms/CheckboxField.vue'
import SelectField from '@/components/core/forms/SelectField.vue'
import TextField from '@/components/core/forms/TextField.vue'
import LottiePlayer from '@/components/core/LottiePlayer.vue'

defineProps(['noBanner', 'noHeading'])

const form = ref({
    zakat: '',
    isi_sendiri: false,
    jumlah: 0,
    description: ''
})

// Zakat options
const zakatOptions = ref({
    'Zakat Maal': 'Zakat Maal',
    'Zakat Profesi': 'Zakat Profesi',
    'Zakat Emas, Perak, dan Logam mulia': 'Zakat Emas, Perak, dan Logam mulia',
    'Zakat Pendapatan Dan Jasa': 'Zakat Pendapatan Dan Jasa',
    'Zakat Perniagaan': 'Zakat Perniagaan',
    'Zakat Pertambangan': 'Zakat Pertambangan',
    'Zakat Pertanian, Perkebunan, dan Kehutanan': 'Zakat Pertanian, Perkebunan, dan Kehutanan',
    'Zakat Perusahaan': 'Zakat Perusahaan',
    'Zakat Peternakan dan Perikanan': 'Zakat Peternakan dan Perikanan',
    'Zakat Rikaz': 'Zakat Rikaz',
    'Zakat uang dan surat berharga lainnya': 'Zakat uang dan surat berharga lainnya'
})

// Dynamic fields for form input
const dynamicFields = ref([])

// Field requirements for each zakat type
const zakatFieldRequirements = {
    'Zakat Maal': [
        {
            id: 'jumlah_harta',
            label: 'Jumlah Harta',
            placeholder: 'Masukkan jumlah harta',
            type: 'rupiah',
            required: true
        }
    ],
    'Zakat Profesi': [
        {
            id: 'gaji',
            label: 'Gaji Bulanan',
            placeholder: 'Masukkan gaji bulanan',
            type: 'rupiah',
            required: true
        },
        {
            id: 'bonus',
            label: 'Bonus Tahunan',
            placeholder: 'Masukkan bonus tahunan',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Emas, Perak, dan Logam mulia': [
        {
            id: 'jumlah_emas',
            label: 'Jumlah Emas (gram)',
            placeholder: 'Masukkan jumlah emas',
            type: 'rupiah',
            required: true
        },
        {
            id: 'harga_emas',
            label: 'Harga Emas per gram',
            placeholder: 'Masukkan harga emas per gram',
            type: 'rupiah',
            required: true
        }
    ],
    'Zakat Pendapatan Dan Jasa': [
        {
            id: 'pendapatan',
            label: 'Pendapatan Bulanan',
            placeholder: 'Masukkan pendapatan bulanan',
            type: 'rupiah',
            required: true
        },
        {
            id: 'biaya_operasional',
            label: 'Biaya Operasional',
            placeholder: 'Masukkan biaya operasional',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Perniagaan': [
        {
            id: 'modal',
            label: 'Modal Dagang',
            placeholder: 'Masukkan modal dagang',
            type: 'rupiah',
            required: true
        },
        {
            id: 'utang_jatuh_tempo',
            label: 'Utang Jatuh Tempo',
            placeholder: 'Masukkan utang jatuh tempo',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Pertambangan': [
        {
            id: 'hasil_tambang',
            label: 'Hasil Tambang',
            placeholder: 'Masukkan hasil tambang',
            type: 'rupiah',
            required: true
        },
        {
            id: 'biaya_produksi',
            label: 'Biaya Produksi',
            placeholder: 'Masukkan biaya produksi',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Pertanian, Perkebunan, dan Kehutanan': [
        {
            id: 'hasil_panen',
            label: 'Hasil Panen',
            placeholder: 'Masukkan hasil panen',
            type: 'rupiah',
            required: true
        },
        {
            id: 'biaya_operasional',
            label: 'Biaya Operasional',
            placeholder: 'Masukkan biaya operasional',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Perusahaan': [
        {
            id: 'pendapatan_tahunan',
            label: 'Pendapatan Tahunan',
            placeholder: 'Masukkan pendapatan tahunan',
            type: 'rupiah',
            required: true
        },
        {
            id: 'pengeluaran_tahunan',
            label: 'Pengeluaran Tahunan',
            placeholder: 'Masukkan pengeluaran tahunan',
            type: 'rupiah',
            required: true
        }
    ],
    'Zakat Peternakan dan Perikanan': [
        {
            id: 'jumlah_ternak',
            label: 'Jumlah Ternak',
            placeholder: 'Masukkan jumlah ternak',
            type: 'rupiah',
            required: true
        },
        {
            id: 'hasil_perikanan',
            label: 'Hasil Perikanan',
            placeholder: 'Masukkan hasil perikanan',
            type: 'rupiah',
            required: false
        }
    ],
    'Zakat Rikaz': [
        {
            id: 'jumlah_temuan',
            label: 'Jumlah Harta Temuan',
            placeholder: 'Masukkan jumlah harta temuan',
            type: 'rupiah',
            required: true
        }
    ],
    'Zakat uang dan surat berharga lainnya': [
        {
            id: 'jumlah_uang',
            label: 'Jumlah Uang',
            placeholder: 'Masukkan jumlah uang',
            type: 'rupiah',
            required: true
        },
        {
            id: 'jumlah_surat_berharga',
            label: 'Jumlah Surat Berharga',
            placeholder: 'Masukkan jumlah surat berharga',
            type: 'rupiah',
            required: false
        }
    ]
}

// Adjust dynamic fields based on selected zakat type
const adjustFields = () => {
    form.value.isi_sendiri = false
    form.value.jumlah = 0
    const selectedZakat = form.value.zakat
    dynamicFields.value = zakatFieldRequirements[selectedZakat] || []
}

// Calculation function for each Zakat type
const calculateZakat = computed(() => {
    const zakatType = form.value.zakat
    const fields = dynamicFields.value
    const values = Object.fromEntries(
        fields.map((field) => [field.id, Number(form.value[field.id])])
    )

    if (zakatType && form.value.isi_sendiri && form.value.jumlah) {
        return form.value.jumlah
    }

    let zakatAmount = 0

    switch (zakatType) {
        case 'Zakat Maal':
            zakatAmount = values.jumlah_harta * 0.025
            break
        case 'Zakat Profesi':
            zakatAmount = (values.gaji + (values.bonus || 0)) * 0.025
            break
        case 'Zakat Emas':
            zakatAmount = values.jumlah_emas * values.harga_emas * 0.025
            break
        case 'Zakat Pendapatan Dan Jasa':
            zakatAmount = (values.pendapatan - (values.biaya_operasional || 0)) * 0.025
            break
        case 'Zakat Perniagaan':
            zakatAmount = (values.modal - (values.utang_jatuh_tempo || 0)) * 0.025
            break
        case 'Zakat Pertambangan':
            zakatAmount = (values.hasil_tambang - (values.biaya_produksi || 0)) * 0.025
            break
        case 'Zakat Pertanian, Perkebunan, dan Kehutanan':
            zakatAmount = (values.hasil_panen - (values.biaya_operasional || 0)) * 0.05
            break
        case 'Zakat Perusahaan':
            zakatAmount = (values.pendapatan_tahunan - values.pengeluaran_tahunan) * 0.025
            break
        case 'Zakat Peternakan dan Perikanan':
            zakatAmount = values.jumlah_ternak * 0.025
            break
        case 'Zakat Rikaz':
            zakatAmount = values.jumlah_temuan * 0.2
            break
        case 'Zakat uang dan surat berharga lainnya':
            zakatAmount = (values.jumlah_uang + (values.jumlah_surat_berharga || 0)) * 0.025
            break
        default:
            return 0
    }
    const returnValue = Number(zakatAmount)
    if (returnValue < 0) {
        return 0
    }
    form.value.jumlah = returnValue
    return returnValue
})

const router = useRouter()
const continuePayment = (event: Event) => {
    router.push({
        path: '/pre-checkout',
        query: { prefillamount: form.value.jumlah, type: form.value.zakat },
        hash: '#field'
    })
}

const isSubmitDisabled = computed(() => {
    if (!form.value.zakat || (form.value.isi_sendiri && !form.value.jumlah)) {
        return true
    }
    if (zakatFieldRequirements.value) {
        for (let field of Object.values(zakatFieldRequirements.value)) {
            for (let f of field) {
                if (f.required && !form.value[f.id]) {
                    return true
                }
            }
        }
    }
    return false
})
</script>
