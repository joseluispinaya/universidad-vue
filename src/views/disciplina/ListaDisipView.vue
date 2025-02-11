<template>
    <div class="about">
        <Loading :isLoading="isLoading" />
        <div class="d-flex flex-column justify-content-center align-items-center">
            <h1 class="mt-4">Panel de Disciplina</h1>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-4">
                <div style="margin: 20px 0;">
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text" id="type-filter">
                                <i class="bi bi-filter"></i> Filtrar por Puntos
                            </span>
                            <select class="form-select" @change="toFilter = $event.target.value; getList()">
                                <option value="">Todos</option>
                                <option v-for="totalPuntos in puntosdi" :value="totalPuntos" :key="totalPuntos">
                                    {{ totalPuntos }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div style="margin: 20px 0;">
                    <div class="mb-3">
                        <button class="btn btn-success btn-sm">
                            <i class="bi bi-file-plus"></i> Nuevo
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Codigo</th>
                            <th>Total Puntos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in itemList" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.nombres }}</td>
                            <td>{{ item.apellidos }}</td>
                            <td>{{ item.codigo }}</td>
                            <td>{{ item.totalPuntos }}</td>
                            <td>
                                <button class="btn btn-dark" style="margin-right: 15px;">
                                    <i class="bi bi-pen"></i> Reporte
                                </button>
                                <button class="btn btn-danger">
                                    <i class="bi bi-trash3"></i> Detalle
                                </button>
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
import Loading from '../../components/Loading.vue'

export default {
    name: 'Disciplina',
    data() {
        return {
            puntosdi: ['10', '30', '50', '80'],
            showModalNuevo: false,
            textToSearch: '',
            toFilter: '',
            itemList: [],
            isLoading: false
        };
    },
    components: {
        Modal,
        Loading
    },
    methods: {
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.isLoading = true;

            this.axios
                .get(`${this.baseUrl}/disiplinas?_expand=estudiante&_expand=tipofalta`)
                .then(function (response) {
                    console.log("Respuesta del servidor:", response);

                    // Agrupar por estudiante y sumar los puntos
                    const puntosPorEstudiante = {};

                    response.data.forEach((item) => {
                        const estudianteId = item.estudiante?.id;

                        if (estudianteId) {
                            if (!puntosPorEstudiante[estudianteId]) {
                                // Inicializar el estudiante con sus datos básicos
                                puntosPorEstudiante[estudianteId] = {
                                    id: estudianteId,
                                    nombres: item.estudiante.nombres || '',
                                    apellidos: item.estudiante.apellidos || '',
                                    codigo: item.estudiante.codigo || '',
                                    totalPuntos: 0,
                                };
                            }
                            // Sumar los puntos del tipo de falta
                            puntosPorEstudiante[estudianteId].totalPuntos += item.tipofalta?.puntos || 0;
                        }
                    });

                    // Convertir el objeto agrupado en un array
                    let data = Object.values(puntosPorEstudiante);

                    const rangos = {
                        '10': { min: 10, max: 30 },
                        '30': { min: 30, max: 50 },
                        '50': { min: 50, max: 80 },
                        '80': { min: 80, max: Infinity }, // Para valores mayores o iguales a 80
                    };

                    // Aplicar el filtro por rango si se seleccionó una opción

                    if (vm.toFilter && rangos[vm.toFilter]) {
                        const { min, max } = rangos[vm.toFilter];
                        data = data.filter(item => item.totalPuntos >= min && item.totalPuntos < max);
                    }

                    vm.itemList = data; // Asignar los datos procesados a itemList
                })
                .catch(function (error) {
                    console.error("Error al obtener las disciplinas:", error);
                })
                .finally(() => {
                    vm.isLoading = false; // Ocultar el indicador de carga
                });
        },
        getListz() {
            const vm = this;
            this.isLoading = true;
            this.axios
                .get(`${this.baseUrl}/disiplinas?_expand=estudiante&_expand=tipofalta`)
                .then(function (response) {
                    console.log("Respuesta del servidor:", response);

                    // Calcula los puntos totales por estudiante
                    const puntosPorEstudiante = {};

                    response.data.forEach((disiplina) => {
                        const estudiante = disiplina.estudiante;
                        if (!puntosPorEstudiante[estudiante.id]) {
                            puntosPorEstudiante[estudiante.id] = {
                                nombres: estudiante.nombres,
                                apellidos: estudiante.apellidos,
                                codigo: estudiante.codigo,
                                totalPuntos: 0,
                            };
                        }
                        puntosPorEstudiante[estudiante.id].totalPuntos += disiplina.tipofalta.puntos;
                    });

                    // Convierte el objeto a una lista
                    vm.itemList = Object.values(puntosPorEstudiante);
                })
                .catch(function (error) {
                    console.error("Error al obtener las disciplinas:", error);
                })
                .finally(() => {
                    vm.isLoading = false; // Oculta el spinner
                });
        },
        buscar() {
            this.getList();
        },
    },
    computed: {
        ...mapState(['count']),
        ...mapGetters(['doubleCount', 'getBaseUrl']),
        baseUrl() {
            return this.getBaseUrl;
        }
    },
    mounted() {
        this.getList();
    },
}
</script>

<style></style>