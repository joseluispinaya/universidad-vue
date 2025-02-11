<template>
    <div>
        <h1>Registrar Carrera</h1>
        <form class="row g-3" @submit.prevent="submitForm()">
            <div class="col-auto">
                <label for="staticEmail2" class="visually-hidden">Carrera</label>
                <input type="text" readonly class="form-control-plaintext" id="staticEmail2" value="Carrera:" />
            </div>
            <div class="col-auto">
                <label for="name" class="visually-hidden">NombreCarrera</label>
                <input type="text" class="form-control" id="name" v-model="form.nombrecarrera"
                    :class="{ 'is-invalid': errors.nombrecarrera }" placeholder="Ingrese la carrera" />
                <div v-if="errors.nombrecarrera" class="invalid-feedback">{{ errors.nombrecarrera }}</div>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary mb-3">Registrar</button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    name: 'RegistroCarrera',
    data() {
        return {
            form: {
                nombrecarrera: ''
            },
            errors: {}
        };
    },
    methods: {
        ...mapActions(['increment']),
        validateForm() {
            this.errors = {};

            if (!this.form.nombrecarrera) {
                this.errors.nombrecarrera = 'La carrera es requerida.';
            }

            return Object.keys(this.errors).length === 0;
        },

        submitForm() {
            if (this.validateForm()) {
                // Enviar los datos al servidor
                this.save();
                // Reiniciar el formulario
                this.form = {
                    nombrecarrera: ''
                };
            }
        },
        save() {
            const vm = this;
            this.axios.post(this.baseUrl + "/api/carreras", this.form)
                .then(function (response) {
                    console.log(response.status)
                    if (response.status == 200) {
                        vm.$emit('on-register', response.data);
                    }
                    console.log(response);
                    //vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    },
    computed: {
        // propiedades computadas que dependen de otras propiedades reactivas
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        }
    },
}
</script>

<style scoped></style>