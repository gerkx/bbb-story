<template>
    <v-container>
        <v-row class="mb-2 px-2">
            <v-col>
                <v-select
                    v-model="presetModel"
                    :items="presetOptions"
                    label="preset"
                    hide-details
                    dense
                />
            </v-col>
        </v-row>
        <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    block
                    :color="pathBtnColor"
                    @click="chooseExportPath"
                >
                    <v-icon class="pr-2">mdi-folder-open</v-icon>
                    <span>{{ exportPathBtn }}</span>
                </v-btn>
            </v-row>
        <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    block
                    @click="exportShots"
                    :disabled="exportDisabled"
                >
                    <v-icon class="pr-2">mdi-content-save</v-icon>
                    <span>Export</span>
                </v-btn>
            </v-row>
    </v-container>
</template>

<script>

// eslint-disable-next-line no-undef
const path = cep_node.require('path')
// eslint-disable-next-line no-undef
const fs = cep_node.require('fs')

import { getPresets } from '../logic/fileIO';
import { exportShots } from '../logic/premiereSeq';

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
        if (prevExport && !this.exportPath && fs.existsSync(prevExport)) {
            this.exportPath = prevExport
        }
    },
    computed: {
        presetOptions() {
            return this.presets.presets ? this.presets.presets : []
        },
        exportPathBtn() {
            if (!this.exportPath) return 'Elegir una ruta de exportar'
            let pathTxt = this.exportPath
            if (this.exportPath.length > 59) {
                let pathParts = pathTxt.split('\\');
                console.log(pathParts)
                pathParts.splice(2, pathParts.length-3, "...")
                console.log(pathParts)
                pathTxt = pathParts.join("\\")
            }
            return pathTxt
        },
        pathBtnColor() {
            return this.exportPath ? 'green' : 'grey'
        },
        exportDisabled() {
            return !this.presetModel || !this.exportPath ? true : false;
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
        },
        async exportShots() {
            const presetPath = path.join(this.presets.path, this.presetModel)
            const exportedShots = exportShots(presetPath, this.exportPath)
            if (exportedShots) {
                console.log(exportedShots)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .picker {
        text-transform: none;
    }
</style>