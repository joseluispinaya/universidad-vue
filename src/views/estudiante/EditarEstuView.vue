<template>
    <div>
        <h1>Editar Estudiante</h1>
        <form @submit.prevent="submitForm" v-if="form">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="carrera">Carrera:</label>
                        <select id="carrera" v-model="form.carreraId" :class="{ 'is-invalid': errors.carreraId }">
                            <option :value="carrera.id" v-for="(carrera, index) in carreraList"
                                :key="`carrera-${index}`">{{
                                    carrera.nombrecarrera }}
                            </option>
                        </select>
                        <div v-if="errors.carreraId" class="invalid-feedback">{{ errors.carreraId }}</div>
                    </div>

                    <div class="form-group">
                        <label for="name">Nombre:</label>
                        <input type="text" id="name" v-model="form.nombres" :class="{ 'is-invalid': errors.nombres }"
                            placeholder="Ingrese su nombre" />
                        <div v-if="errors.nombres" class="invalid-feedback">{{ errors.nombres }}</div>
                    </div>

                    <div class="form-group">
                        <label for="apellidos">apellidos:</label>
                        <input type="text" id="apellidos" v-model="form.apellidos"
                            :class="{ 'is-invalid': errors.apellidos }" placeholder="Ingrese su apellidos" />
                        <div v-if="errors.apellidos" class="invalid-feedback">{{ errors.apellidos }}</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="nroci">nroci:</label>
                        <input type="text" id="nroci" v-model="form.nroci" :class="{ 'is-invalid': errors.nroci }"
                            placeholder="Ingrese su nroci" />
                        <div v-if="errors.nroci" class="invalid-feedback">{{ errors.nroci }}</div>
                    </div>
                    <div class="form-group">
                        <label for="codigo">codigo:</label>
                        <input type="text" id="codigo" v-model="form.codigo" :class="{ 'is-invalid': errors.codigo }"
                            placeholder="Ingrese su codigo" />
                        <div v-if="errors.codigo" class="invalid-feedback">{{ errors.codigo }}</div>
                    </div>
                    <div class="form-group">
                        <label for="correo">correo:</label>
                        <input type="text" id="correo" v-model="form.correo" :class="{ 'is-invalid': errors.correo }"
                            placeholder="Ingrese su correo" />
                        <div v-if="errors.correo" class="invalid-feedback">{{ errors.correo }}</div>
                    </div>
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Actualizar</button>
        </form>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
    name: 'EditarEstu',
    data() {
        return {
            carreraList: [],
            errors: {}
        };
    },
    methods: {
        ...mapActions(['increment']),
        validateForm() {
            this.errors = {};

            if (!this.form.nombres) {
                this.errors.nombres = 'El nombre es obligatorio.';
            }

            if (!this.form.apellidos) {
                this.errors.apellidos = 'El apellido es obligatoria.';
            }

            if (!this.form.nroci) {
                this.errors.nroci = 'El CI es obligatoria.';
            }

            if (!this.form.codigo) {
                this.errors.codigo = 'El codigo es obligatoria.';
            }

            if (!this.form.correo) {
                this.errors.correo = 'El correo es obligatoria.';
            }

            if (!this.form.carreraId) {
                this.errors.carreraId = 'La Carrera es obligatoria.';
            }

            return Object.keys(this.errors).length === 0;
        },
        submitForm() {
            if (this.validateForm()) {
                // Enviar los datos al servidor
                this.save();
                // Reiniciar el formulario
                this.form = {
                    nombres: '',
                    apellidos: '',
                    nroci: '',
                    codigo: '',
                    correo: '',
                    carreraId: null
                };
            }
        },
        save() {
            const vm = this;
            this.axios.patch(this.baseUrl + "/estudiantes/" + this.item.id, this.form)
                .then(function (response) {
                    if (response.status == '200') {
                        vm.$emit('on-update', response.data);
                    }
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        getCarrerasList() {
            const vm = this;
            this.axios.get(this.baseUrl + "/carreras")
                .then(function (response) {
                    vm.carreraList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        },
        form() {
            return Object.assign({},this.item);
        }
    },
    mounted() {
        this.getCarrerasList();
    },
    props: ['item']
}
</script>

<style scoped></style>