<template>
    <v-dialog v-model="modal" persistent>
        <v-btn 
            class="mt-n8"
            fab 
            absolute 
            right
            icon
            small
            @click="cancel"
        >
            <v-icon color="grey">mdi-close</v-icon>
        </v-btn>

        <v-card>
            <v-form v-model="valid" class="pa-6">
                <v-container>
                    <v-row>
                        <v-select
                            v-model="lineal"
                            :items="sortedSeq"
                            :disabled="loading"
                            :rules="rules"
                            item-text="name"
                            item-value="sequenceID"
                            label="Elegir la secuencia lineal"
                        />

                        <v-btn 
                            color="primary"
                            class="ml-2"
                            :disabled="!valid || !lineal"
                            @click="ok"
                        >
                            OK
                        </v-btn>
                    </v-row>
                </v-container>
            </v-form>

            <v-progress-linear :active="loading" indeterminate />
        </v-card>        

    </v-dialog>
</template>

<script>
export default {
    name: 'ChooseLinealModal',
    props: {
        modal: { type: Boolean, required: true },
        loading: { type: Boolean, required: true },
        sequences: { type: Array, required: true },
        xml: { type: Object, default: null },
    },
    data: () => ({
        lineal: null,
        valid: false,
        rules: [ v => !!v || 'Hay que seleccionar una secuencia' ],
    }),
    computed: {
        sortedSeq () {
            // const linealSeq = [];
            // const nonLinealSeq = [];
            let linealSeq = this.sequences.filter(x => {
                return x.name.toLowerCase().includes('lineal')
            })
            let nonLinealSeq = this.sequences.filter(x => {
                return !(x.name.toLowerCase().includes('lineal'))
            })
            linealSeq.sort((a,b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0
            }).reverse()
            nonLinealSeq.sort((a,b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0
            })
            const sortedList = [...linealSeq, ...nonLinealSeq]
            return sortedList
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        ok() {
            this.$emit('ok',this.lineal)
        }
    }
}
</script>