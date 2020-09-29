<template>
    <v-container>
            <v-row class="mb-2 px-2">
                <v-btn block class="picker" :color=xml.color >
                    <v-icon class="pr-2">mdi-xml</v-icon>
                    <span>{{xml.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2">
                <v-btn block class="picker" :color=video.color >
                    <v-icon class="pr-2">mdi-video</v-icon>
                    <span>{{video.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2">
                <v-btn block class="picker" :color=lineal.color >
                    <v-icon class="pr-2">mdi-file-video</v-icon>
                    <span>{{lineal.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2" justify="center">
                <v-btn :disabled="!enableCreate" block outlined class="picker">
                    <v-icon class="pr-2" small>mdi-wrench</v-icon>
                    <span>Hacer animatic</span>
                </v-btn>
            </v-row>
            
    </v-container>
</template>

<script>
import { clr } from '../logic/colors'
export default {
    name: 'Import',
    components: {

    },
    data: () => ({
        valid: false,
        xmlPath: null,
        videoPath: null,
        linealSequence: null,
        animaticSequenceName: null,
        colors: clr.colors
    }),
    computed: {
        xml() {
            console.log(clr.ok)
            if (!this.xmlPath) return {
                name: "Archivo de XML",
                color: clr.neutral
            }
            return {
                name: this.xmlPath,
                color: clr.ok    
            }
        },
        video() {
            if (!this.videoPath) return {
                name: "Archivo de vídeo", 
                color: clr.neutral
            }
            return {
                name: this.videoPath,
                color: clr.ok
            }
        },
        lineal() {
            if (!this.linealSequence) return {
                name: "Secuencia lineal",
                color: clr.neutral    
            }
            return {
                name: this.linealSequence,
                color: clr.ok    
            }
        },
        enableCreate() {
            if (this.linealSequence && this.videoPath && this.xmlPath) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        xmlPath: function(val) {
            console.log(val)
        }
    },
    methods: {

    }
    
}
</script>

<style lang="scss" scoped>
// $btn-text-transform: none !default;
    .picker {
        text-transform: none;
    }
</style>