<template>
    <div class="about">
        <Loading :isLoading="isLoading" />
        <Modal v-model:modelValue="showModalNuevo">
            <RegistroEstuView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditarEstuView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="mt-4">Panel de Estudiantes</h1>
        </div>

        <div>
            <div class="row">
                <div class="col-md-12">
                    <button @click="showModalNuevo = true" class="btn btn-success btn-sm"><i class="bi bi-file-plus"></i>
                        Nuevo</button>
                    <button @click="buscar()" class="btn btn-lith" style="float:right"><i class="bi bi-search"></i> Buscar</button>
                    <input type="search" style="float:right" v-model="textToSearch" @search="buscar()" placeholder="Buscar por nombre">
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Nro CI</th>
                            <th>Codigo</th>
                            <th>Correo</th>
                            <th>Carrera</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in itemList" :key="index">
                            <td>{{ 1 + index }}</td>
                            <td>{{ item.nombres }}</td>
                            <td>{{ item.apellidos }}</td>
                            <td>{{ item.nroci }}</td>
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.correo }}</td>
                            <td>{{ item.carrera.nombrecarrera }}</td>
                            <td>
                                <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;"><i
                                        class="bi bi-pen"></i>
                                    Editar</button>
                                <button @click="Eliminar(item.id)" class="btn btn-danger"><i class="bi bi-trash3"></i>
                                    Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import Loading from '../../components/Loading.vue';
import RegistroEstuView from './RegistroEstuView.vue'
import EditarEstuView from './EditarEstuView.vue'

export default {
    name: 'Estudiante',
    data() {
        return {
            message: 'Hola Mundo',
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            itemList: [],
            isLoading: false
        }
    },
    components: {
        Modal,
        RegistroEstuView,
        EditarEstuView,
        Loading
    },
    methods: {
        ...mapActions(['increment']),
        getLista() {
            const vm = this;
            this.axios.get(this.baseUrl + "/estudiantes?_expand=carrera&q=" + this.textToSearch)
                .then(function (response) {
                    console.log(response);
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        getList() {
            const vm = this;
            this.isLoading = true;
            this.axios
                .get(`${this.baseUrl}/estudiantes?_expand=carrera&q=${this.textToSearch}`)
                .then(function (response) {
                    console.log("Respuesta del servidor:", response);
                    vm.itemList = response.data; // Los datos ahora incluirán la carrera relacionada
                })
                .catch(function (error) {
                    console.error("Error al obtener estudiantes:", error);
                })
                .finally(() => {
                    vm.isLoading = false; // Oculta el spinner
                });
        },
        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/estudiantes/" + id)
                    .then(function (response) {
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }

        },
        buscar() {
            this.getList();
        },
        onRegister(event) {
            console.log("on register");
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            console.log("on update");
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info');
        },
        showToast(message, type) {
            console.log("showToast");
            this.$toast.show(message, type);
        }
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl
        }
    },
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        this.getList();
    },
    emits: []
}
</script>

<style></style>