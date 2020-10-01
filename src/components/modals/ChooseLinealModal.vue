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
                            :items="sequences"
                            :disabled="loading"
                            item-text="name"
                            item-value="sequenceID"
                            label="Elegir la secuencia lineal"
                        />


                        <v-btn 
                            color="primary"
                            class="ml-2"
                            :disabled="!valid"
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
    },
    data: () => ({
        lineal: null,
        valid: false,
    }),
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        ok() {
            this.$emit('ok', this.lineal)
        }
    }
}
</script>