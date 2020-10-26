<template>
    <v-container>
        <v-btn @click="test">test</v-btn>
        <v-row>
            <v-col>
                <v-select
                    v-model="presetModel"
                    :items="presetOptions"
                    label="preset"
                />
            </v-col>
        </v-row>
        <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    block
                    @click="chooseExportPath"
                >
                    <v-icon class="pr-2">mdi-content-save</v-icon>
                    <span>{{ exportPathBtn }}</span>
                </v-btn>
            </v-row>
    </v-container>
</template>

<script>

// eslint-disable-next-line no-undef
const path = cep_node.require('path')

import { getPresets } from '../logic/fileIO'
// import {exportClip} from '../logic/premiereSeq'

export default {
    name: 'Export',
    data: () => ({
        presets: [],
        presetModel: null,
        exportPath: null,
    }),
    mounted() {
        this.presets = getPresets()
        if (this.presets.model && !this.presetModel) {
            this.presetModel = this.presets.model
        }
        const prevExport = localStorage.getItem('animaticExportPath');
        if (prevExport && !this.exportPath) {
            this.exportPath = prevExport
        }
    },
    computed: {
        presetOptions() {
            return this.presets.presets ? this.presets.presets : []
        },
        exportPathBtn() {
            if (this.exportPath) return this.exportPath
            return 'Elegir una ruta de exportar'
        },
    },
    methods: {
        test() {
            console.log('test')
            console.log(getPresets())
        },
        chooseExportPath() {
            const opts = [
                false,
                true,
                'Ruta para sacar los planos'
            ]
            if (this.exportPath) {
                opts.push(this.exportPath)
            } else {
                opts.push('')
            }
            const loc = window.cep.fs.showOpenDialog(...opts)
            if (loc) {
                if (loc.err !== 0) return console.log(loc.err)
                const sepPath = loc.data[0].split("/").join(path.sep)
                localStorage.setItem('animaticExportPath', sepPath)
                this.exportPath = sepPath
                return sepPath
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .picker {
        text-transform: none;
    }
</style>