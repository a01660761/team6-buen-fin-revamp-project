import { TranslationMessages } from "ra-core";

const spanishMessages: TranslationMessages = {
    ra: {
        action: {
            add_filter: "Agregar filtro",
            add: "Agregar",
            back: "Regresar",
            bulk_actions: "1 elemento seleccionado |||| %{smart_count} elementos seleccionados",
            cancel: "Cancelar",
            clear_array_input: "Borrar la lista",
            clear_input_value: "Borrar un valor",
            clone: "Clonar",
            confirm: "Confirmar",
            create: "Crear",
            create_item: "Crear %{item}",
            delete: "Eliminar",
            edit: "Editar",
            export: "Exportar",
            list: "Lista",
            refresh: "Actualizar",
            remove_filter: "Eliminar este filtro",
            remove_all_filters: "Eliminar todos los filtros",
            remove: "Eliminar",
            reset: "Restablecer",
            save: "Guardar",
            search: "Buscar",
            search_columns: "Buscar columnas",
            select_all: "Seleccionar todo",
            select_all_button: "Seleccionar todo (boton)",
            select_row: "Seleccionar esta fila",
            show: "Mostrar",
            sort: "Ordenar",
            undo: "Deshacer",
            unselect: "Deseleccionar",
            expand: "Expandir",
            close: "Cerrar",
            open_menu: "Abrir menú",
            close_menu: "Cerrar menú",
            update: "Actualizar",
            move_up: "Mover arriba",
            move_down: "Mover abajo",
            open: "Abrir",
            toggle_theme: "Cambiar modo (claro/oscuro)",
            select_columns: "Seleccionar columnas",
            update_application: "Recargar la aplicación",
        },

        boolean: {
            true: "Sí",
            false: "No",
            null: " ",
        },

        page: {
            create: "Crear %{name}",
            dashboard: "Panel principal",
            edit: "%{name} %{recordRepresentation}",
            error: "Error detectado",
            list: "%{name}",
            loading: "Cargando",
            not_found: "No encontrado",
            show: "%{name} %{recordRepresentation}",
            empty: "Aún no hay %{name}.",
            invite: "¿Deseas agregar uno?",
            access_denied: "Acceso denegado",
            authentication_error: "Error de autenticación",
        },

        input: {
            file: {
                upload_several:
                    "Arrastra varios archivos para subirlos o haz clic para seleccionarlos.",
                upload_single:
                    "Arrastra un archivo para subirlo o haz clic para seleccionarlo.",
            },

            image: {
                upload_several:
                    "Arrastra varias imágenes para subirlas o haz clic para seleccionarlas.",
                upload_single:
                    "Arrastra una imagen para subirla o haz clic para seleccionarla.",
            },

            references: {
                all_missing:
                    "No se pudieron encontrar los datos de referencia.",
                many_missing:
                    "Al menos una de las referencias asociadas ya no está disponible.",
                single_missing:
                    "La referencia asociada ya no está disponible.",
            },

            password: {
                toggle_visible: "Ocultar contraseña",
                toggle_hidden: "Mostrar contraseña",
            },
        },

        message: {
            about: "Acerca de",

            access_denied:
                "No tienes los permisos necesarios para acceder a esta página",

            are_you_sure: "¿Estás seguro?",

            authentication_error:
                "El servidor de autenticación devolvió un error; no fue posible verificar tus credenciales.",

            auth_error:
                "Ocurrió un error al validar el token de autenticación.",

            bulk_delete_content:
                "¿Estás seguro de que deseas eliminar este %{name}? |||| ¿Estás seguro de que deseas eliminar estos %{smart_count} elementos?",

            bulk_delete_title:
                "Eliminar %{name} |||| Eliminar %{smart_count} %{name}",

            bulk_update_content:
                "¿Estás seguro de que deseas actualizar %{name} %{recordRepresentation}? |||| ¿Estás seguro de que deseas actualizar estos %{smart_count} elementos?",

            bulk_update_title:
                "Actualizar %{name} %{recordRepresentation} |||| Actualizar %{smart_count} %{name}",

            clear_array_input:
                "¿Estás seguro de que deseas borrar toda la lista?",

            delete_content:
                "¿Estás seguro de que deseas eliminar este %{name}?",

            delete_title:
                "Eliminar %{name} %{recordRepresentation}",

            details: "Detalles",

            error:
                "Ocurrió un error del cliente y no se pudo completar la solicitud.",

            invalid_form:
                "El formulario no es válido. Revisa los errores.",

            loading: "Por favor espera",

            no: "No",

            not_found:
                "Es posible que hayas escrito una URL incorrecta o seguido un enlace inválido.",

            select_all_limit_reached:
                "Hay demasiados elementos para seleccionarlos todos. Solo se seleccionaron los primeros %{max} elementos.",

            unsaved_changes:
                "Algunos cambios no se guardaron. ¿Estás seguro de que deseas ignorarlos?",

            yes: "Sí",

            placeholder_data_warning:
                "Problema de red: no se pudieron actualizar los datos.",
        },

        navigation: {
            clear_filters: "Borrar filtros",

            no_filtered_results:
                "No se encontró %{name} con los filtros actuales.",

            no_results: "No se encontró %{name}",

            no_more_results:
                "La página %{page} está fuera de los límites. Intenta regresar a la página anterior.",

            page_out_of_boundaries:
                "La página %{page} está fuera de los límites",

            page_out_from_end:
                "No se puede avanzar después de la última página",

            page_out_from_begin:
                "No se puede retroceder antes de la página 1",

            page_range_info:
                "%{offsetBegin}-%{offsetEnd} de %{total}",

            partial_page_range_info:
                "%{offsetBegin}-%{offsetEnd} de más de %{offsetEnd}",

            current_page: "Página %{page}",

            page: "Ir a la página %{page}",

            first: "Ir a la primera página",

            last: "Ir a la última página",

            next: "Ir a la siguiente página",

            previous: "Ir a la página anterior",

            page_rows_per_page: "Filas por página:",

            skip_nav: "Saltar al contenido",
        },

        sort: {
            sort_by: "Ordenar por %{field_lower_first} %{order}",
            ASC: "ascendente",
            DESC: "descendente",
        },

        auth: {
            auth_check_error: "Por favor inicia sesión para continuar",

            user_menu: "Perfil",

            username: "Nombre de usuario",

            password: "Contraseña",

            email: "Correo electrónico (email)",

            sign_in: "Iniciar sesión",

            sign_in_error:
                "La autenticación falló. Inténtalo nuevamente.",

            logout: "Cerrar sesión",
        },

        notification: {
            updated: "Elemento actualizado |||| %{smart_count} elementos actualizados",
            created: "Elemento creado",
            deleted:
                "Elemento eliminado |||| %{smart_count} elementos eliminados",
            bad_item: "Elemento incorrecto",
            item_doesnt_exist: "El elemento no existe",
            http_error: "Error de comunicación con el servidor",
            data_provider_error:
                "Error del dataProvider. Revisa la consola para más detalles.",
            i18n_error:
                "No se pudieron cargar las traducciones para el idioma seleccionado",
            canceled: "Acción cancelada",
            logged_out:
                "Tu sesión ha terminado. Vuelve a iniciar sesión.",
            not_authorized:
                "No estás autorizado para acceder a este recurso.",
            application_update_available:
                "Hay una nueva versión disponible.",
            offline:
                "Sin conexión. No se pudieron obtener los datos.",
        },

        validation: {
            required: "Obligatorio",
            minLength:
                "Debe tener al menos %{min} caracteres",
            maxLength:
                "Debe tener %{max} caracteres o menos",
            minValue:
                "Debe ser al menos %{min}",
            maxValue:
                "Debe ser %{max} o menos",
            number: "Debe ser un número",
            email: "Debe ser un correo electrónico válido",
            oneOf:
                "Debe ser una de las siguientes opciones: %{options}",
            regex:
                "Debe coincidir con el formato especificado: %{pattern}",
            unique: "Debe ser único",
        },

        saved_queries: {
            label: "Consultas guardadas",
            query_name: "Nombre de la consulta",
            new_label: "Guardar consulta actual...",
            new_dialog_title:
                "Guardar consulta actual como",
            remove_label:
                "Eliminar consulta guardada",
            remove_label_with_name:
                'Eliminar consulta "%{name}"',
            remove_dialog_title:
                "¿Eliminar consulta guardada?",
            remove_message:
                "¿Estás seguro de que deseas eliminar este elemento de tu lista de consultas guardadas?",
            help:
                "Filtra la lista y guarda esta consulta para usarla después",
        },

        guesser: {
            empty: {
                title: "No hay datos para mostrar",
                message: "Por favor revisa tu data provider",
            },
        },

        configurable: {
            customize: "Personalizar",

            configureMode:
                "Configurar esta página",

            inspector: {
                title: "Inspector",

                content:
                    "Pasa el cursor sobre los elementos de la interfaz para configurarlos",

                reset:
                    "Restablecer configuración",

                hideAll: "Ocultar todo",

                showAll: "Mostrar todo",
            },

            Datagrid: {
                title: "Tabla de datos",

                unlabeled:
                    "Columna sin etiqueta #%{column}",
            },

            SimpleForm: {
                title: "Formulario",

                unlabeled:
                    "Campo sin etiqueta #%{input}",
            },

            SimpleList: {
                title: "Lista",

                primaryText: "Texto principal",

                secondaryText: "Texto secundario",

                tertiaryText: "Texto terciario",
            },
        },
    },

    resources: {
        users: {
            name: "Usuario |||| Usuarios",
            fields: {
                id: "ID",
                name: "Nombre",
                username: "Nombre de usuario",
                email: "Correo electrónico",
                address: {
                    street: "Calle",
                    suite: "Domicilio (suite)",
                    city: "Ciudad",
                    zipcode: "Código postal",
                    geo: {
                        lat: "Latitud",
                        lng: "Longitud",
                    },
                },
                phone: "Teléfono",
                website: "Sitio web",
                company: {
                    name: "Empresa",
                    catchPhrase: "Eslogan",
                    bs: "Descripción empresarial",
                },
            },
        },

        posts: {
            name: "Publicación |||| Publicaciones",
            fields: {
                id: "ID",
                userId: "Usuario",
                title: "Título",
                body: "Contenido",
            },
        },

        comments: {
            name: "Comentario |||| Comentarios",
            fields: {
                id: "ID",
                postId: "Publicación",
                name: "Nombre",
                email: "Correo electrónico",
                body: "Comentario",
            },
        },

        albums: {
            name: "Álbum |||| Álbumes",
            fields: {
                id: "ID",
                userId: "Usuario",
                title: "Título",
            },
        },

        photos: {
            name: "Foto |||| Fotos",
            fields: {
                id: "ID",
                albumId: "Álbum",
                title: "Título",
                url: "URL",
                thumbnailUrl: "URL de la miniatura",
            },
        },

        todos: {
            name: "Tarea |||| Tareas",
            fields: {
                id: "ID",
                userId: "Usuario",
                title: "Título",
                completed: "Completada",
            },
        },

        businesses: {
            name: "Comercio |||| Comercios",
            fields: {
                id: "ID",
                name: "Nombre",
                category: "Categoría",
                physicalStore: "Tienda física",
                description: "Descripción",
                address: "Dirección",
                contactEmail: "Correo de contacto",
                contactPhone: "Teléfono de contacto",
                websiteUrl: "Sitio web",
            },
        },
    },

    dashboard: {
        title: "ADMINISTRACIÓN",
        loading_posts: "Cargando publicaciones...",
        error_loading_posts: "Error al cargar las publicaciones.",
        total_posts: "Total de publicaciones: %{total}",
    },

    directory: {
        title: "Buscador de comercios participantes",
        demo_notice: "Datos de demostración: estos comercios no son reales ni oficiales.",
        search_business: "Buscar comercio",
        physical_store: "Tienda física",
        category: "Categoría",
        all: "Todas",
        yes: "Sí",
        no: "No",
        search: "Buscar",
        loading: "Cargando comercios...",
        error: "No pudimos cargar los comercios. Intenta de nuevo más tarde.",
        empty: "No encontramos comercios con esa búsqueda.",
        page: "Página",
        go: "Ir",
        go_to_page: "Ir a la página",
        back: "Volver al buscador",
    },
};

export default spanishMessages;