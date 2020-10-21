<template>
    <v-container class="pa-5">
        <v-form v-model="valid">
            <v-row>
                <v-col class="pb-0">
                    <v-text-field 
                        v-model="program"
                        label="programa"
                        :rules="[v => !!v || 'Hay que indicar la programa']"
                        required
                        dense
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-text-field 
                        v-model="season"
                        label="temporada"
                        :rules="[v => !!v || 'Hay que indicar la temporada']"
                        required
                        dense
                    />
                </v-col>
                <v-col cols="6">
                    <v-text-field 
                        v-model="episode"
                        label="episodio"
                        :rules="[v => !!v || 'Hay que indicar el episodio']"
                        required
                        dense
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-slider
                        v-model="target"
                        min="1"
                        :max="maxTrack"
                        thumb-label
                    />
                </v-col>
                <v-col cols="auto">
                    <span>{{ target }}</span>
                </v-col>
            </v-row>
            <v-row class="px-2">
                <v-btn block  :disabled="!valid" @click="makeSupers">
                    <v-icon>mdi-image</v-icon>
                    <span color="" class="px-2">Supers</span>
                </v-btn>
            </v-row>

        </v-form>
    </v-container>
</template>

<script>
import { createSupers, getNumberOfVideoTracks } from '../logic/premiereSeq'

export default {
    name: 'Supers',
    data: () => ({
        valid: false,
        program: null,
        season: null,
        episode: null,
        numTracks: null,
        targetTrackModel: null,
        targetDirty: false,
    }),
    computed: {
        maxTrack() {
            if (this.numTracks) return this.numTracks
            return 1
        },
        target: {
            get() {
                if (this.targetDirty) {
                    return this.targetTrackModel
                }
                if (this.numTracks) {
                    return this.numTracks
                }
                return 1
            },
            set(val) {
                this.targetDirty = true;
                this.targetTrackModel = val
            }
        },
    },
    mounted() {
        console.log("mounted")
        this.getNumTracks()
        window.addEventListener('focus', this.focus);
        const superStore = localStorage.getItem('superStore');
        if (superStore) {
            const { program, season, episode } = JSON.parse(superStore);
            this.program = program;
            this.season = season;
            this.episode = episode;
        }

    },
    deactivated() {
        console.log('unmounted')
    },
    methods: {
        setLocalStore() {
            localStorage.setItem('superStore', JSON.stringify({
                program: this.program,
                season: this.season,
                episode: this.episode,
            }))
        },
        async makeSupers() {
            this.setLocalStore();
            const supers = await createSupers({
                program: this.program,
                season: this.season,
                episode: this.episode,
                target: this.target,
            })
            console.log(supers)
        },
        async getNumTracks() {
            const trks = await getNumberOfVideoTracks();
            if (trks) {
                this.numTracks = trks
                if(!this.targetDirty) {
                    this.targetTrackModel = trks
                }
            }
            console.log(this.numTracks)
        },
        async focus() {
            console.log('focused')
            const trks = await getNumberOfVideoTracks();
            if (trks) {
                this.numTracks = trks
            }
        },
    }
}
</script>