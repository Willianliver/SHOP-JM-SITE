import MenuDesktopVinci from "./components/MenuDesktopVinci";

MenuDesktopVinci.schema = {
    title: "Menu Desktop",
    description: "Menu Desktop",
    type: "object",
    properties: {
        titulo : {
            title: "Título do menu de categorias",
            description: "Titulo do menu que que todas as categorias",
            type: "string",
            default: "Todas as categorias"
        },
        ofertas : {
            title: "Ofertas",
            description: "Titulo do link de ofertas",
            type: "string",
            default: "Ofertas"
        }
    }
}

export default MenuDesktopVinci;