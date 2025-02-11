<template>
    <div class="about">
        <Loading :isLoading="isLoading" />
        <Modal v-model:modelValue="showModalNuevo">
            <RegistroCarreraView @on-register="onRegister($event)" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <EditarCarreraView @on-update="onUpdate($event)" :item="itemToEdit" />
        </Modal>
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="mt-4">Panel de Carreras</h1>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div>
                    <div class="row">
                        <div class="col-md-12">
                            <button @click="showModalNuevo = true" class="btn btn-success btn-sm"><i
                                    class="bi bi-file-plus"></i>
                                Nuevo</button>
                            <button @click="buscar()" class="btn btn-lith" style="float:right"><i
                                    class="bi bi-search"></i> Buscar</button>
                            <input type="search" style="float:right" v-model="textToSearch" @search="buscar()"
                                placeholder="Buscar por carrera">
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <table>
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Descripcion</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in itemList" :key="index">
                                    <td>{{ 1 + index }}</td>
                                    <td>{{ item.nombrecarrera }}</td>
                                    <td>
                                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;"><i
                                                class="bi bi-pen"></i>
                                            Editar</button>
                                        <button @click="Eliminar(item.id)" class="btn btn-danger"><i
                                                class="bi bi-trash3"></i>
                                            Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <h1 class="mt-4 mb-4">Carreras EMI</h1>
                    <img alt="Vue logo" src="../../assets/logo.png">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import Loading from '../../components/Loading.vue';
import RegistroCarreraView from './RegistroCarreraView.vue'
import EditarCarreraView from './EditarCarreraView.vue'

export default {
    name: 'Carrera',
    data() {
        return {
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
        RegistroCarreraView,
        EditarCarreraView,
        Loading
    },
    methods: {
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.isLoading = true;
            // .get(`${this.baseUrl}/carreras?q=${this.textToSearch}`)
            this.axios
                .get(`${this.baseUrl}/api/carreras`)
                .then(function (response) {
                    console.log("Respuesta del servidor:", response);
                    vm.itemList = response.data;
                })
                .catch(function (error) {
                    console.error("Error al obtener las carreras:", error);
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
                this.axios.delete(this.baseUrl + "/api/carreras/" + id)
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