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
                        <v-text-field
                            v-model="formName"
                            label="Nombre de la secuencia"
                            :rules="nameRules"
                            dense
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
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'NameSeqModal',
    props: {
        modal: { type: Boolean, required: true },
        linealName: { type: String, default: "monster_XXX_lineal_vXXX" }
    },
    data: () => ({
        valid: false,
        name: null,
        nameRules: [ v => !!v || 'Se requiere un nombre' ],
        nameDirty: false
    }),
    computed: {
        formName: {
            get() {
                if (!this.name && !this.nameDirty) {
                    const base = this.linealName.split('lineal')[0]
                    return `${base}animatic_v001`
                }
                return this.name
            },
            set(val) {
                this.nameDirty = true
                if (val) {
                    this.name = val.split(" ").join("_")
                } else {
                    this.name = null
                }
            }
        },
    },
    methods: {
        cancel() {
            this.$emit('cancel');
            const base = this.linealName.split('lineal')[0]  
            this.name = `${base}animatic_v001`;
            this.nameDirty = false;
        },
        ok() {
            this.$emit('ok', this.name);
            const base = this.linealName.split('lineal')[0]  
            this.name = `${base}animatic_v001`;
            this.nameDirty = false;
        }
    },
}
</script>