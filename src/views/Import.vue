<template>
    <v-container>
            <v-btn @click="test">test</v-btn>
            <NameSeqModal 
                :linealName="lineal.name" 
                :modal="animaticSequenceNameModal"
                @cancel="toggleAnimaticSequenceNameModal"
                @ok="createAnimatic"
            />
            <ChooseLinealModal
                :modal="linealSequenceModal"
                :loading="linealSequenceLoading"
                :sequences="sequences"
                @cancel="toggleLinealSequenceModal"
                @ok="setLineal"
            />
            <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    :color=xml.color 
                    block 
                    @click="chooseXMLFile"
                >
                    <v-icon class="pr-2">mdi-xml</v-icon>
                    <span>{{xml.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    :color=video.color 
                    block
                    @click="chooseVideoFile"
                >
                    <v-icon class="pr-2">mdi-file-video</v-icon>
                    <span>{{video.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2">
                <v-btn 
                    class="picker" 
                    :color=lineal.color 
                    block 
                    @click="chooseLineal"
                >
                    <v-icon class="pr-2">mdi-chart-timeline</v-icon>
                    <span>{{lineal.name}}</span>
                </v-btn>
            </v-row>
            <v-row class="mb-2 px-2" justify="center">
                <v-btn 
                    :disabled="!enableCreate" 
                    class="picker"
                    block 
                    outlined 
                    @click="toggleAnimaticSequenceNameModal"
                >
                    <v-icon class="pr-2" small>mdi-wrench</v-icon>
                    <span>Hacer animatic</span>
                </v-btn>
            </v-row>
            
    </v-container>
</template>

<script>
// eslint-disable-next-line no-undef
const path = cep_node.require('path')

import NameSeqModal from '../components/modals/NameSeqModal';
import ChooseLinealModal from '../components/modals/ChooseLinealModal';

import { clr } from '../logic/colors';
import { chooseFile } from '../logic/fileIO';
import { getSequences, createAnimaticSeq } from '../logic/premiereSeq';
// import { xml2obj } from '../logic/xml'


export default {
    name: 'Import',
    components: {
        NameSeqModal,
        ChooseLinealModal,
    },
    // mounted () {
    //     console.log(this.lineal.name)
    // },
    data: () => ({
        valid: false,
        xmlPath: null,
        videoPath: null,
        sequences: [],
        linealSequence: null,
        linealSequenceModal: false,
        linealSequenceLoading: false,
        animaticSequenceName: null,
        animaticSequenceNameModal: false,
        colors: clr.colors
    }),
    computed: {
        xml() {
            if (!this.xmlPath) return {
                name: "Archivo de XML",
                color: clr.neutral
            }
            return {
                name: path.basename(this.xmlPath),
                color: this.colors[6]    
            }
        },
        video() {
            if (!this.videoPath) return {
                name: "Archivo de vídeo", 
                color: clr.neutral
            }
            return {
                name: path.basename(this.videoPath),
                color: this.colors[11]
            }
        },
        lineal() {
            if (!this.linealSequence) return {
                name: "Secuencia lineal",
                color: clr.neutral    
            }
            return {
                name: this.linealSequence.name,
                color: this.colors[4]    
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
    methods: {
        toggleAnimaticSequenceNameModal() {
            this.animaticSequenceNameModal = !this.animaticSequenceNameModal;
        },
        toggleLinealSequenceModal() {
            this.linealSequenceModal = !this.linealSequenceModal;
        },
        toggleLinealSequenceLoading() {
            this.linealSequenceLoading = !this.linealSequenceLoading;
        },
        createAnimatic(seqName) {
            this.toggleAnimaticSequenceNameModal()
            this.animaticSequenceName = seqName
            console.log(this.animaticSequenceName)
        },
        chooseXMLFile() {
            const xmlPath = chooseFile(['.xml', 'xml']);
            if (xmlPath && path.extname(xmlPath) === '.xml'){
                this.xmlPath = xmlPath
            }
        },
        chooseVideoFile() {
            const ext = ['.mp4', '.mov', '.m4v']
            const vidPath = chooseFile(ext)
            if (vidPath &&  ext.includes(path.extname(vidPath))){
                this.videoPath = vidPath
            }
        },
        async chooseLineal() {
            this.toggleLinealSequenceLoading();
            this.toggleLinealSequenceModal();
            const seqArr = await getSequences()
                .catch(err => console.log(err));
            // const seqArr = []
            if (seqArr) {
                this.sequences = seqArr;
                this.toggleLinealSequenceLoading();
            }
        },
        setLineal(sequenceID) {
            const linealSeq = this.sequences.find(seq => {
                return seq.sequenceID == sequenceID
            })
            console.log(linealSeq)
            if (linealSeq) this.linealSequence = linealSeq;
            this.toggleLinealSequenceModal();
        },
        test() {
            console.log(this.linealSequence)
            const p = "F:/story/MM_138_cajas_de_Carton_Cl_v1.xml"
            createAnimaticSeq(p, this.linealSequence)
        }
    }
    
}
</script>

<style lang="scss" scoped>
    .picker {
        text-transform: none;
    }
</style>