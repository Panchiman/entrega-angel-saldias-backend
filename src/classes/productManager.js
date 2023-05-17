import fs from 'fs';


export default class ProductManager {
    constructor(products = []) {
        this.products = products;
        this.path = 'src/data/products.json';
        // En la consigna no me quedo claro si esto era lo que pedian o pedian que cuando se inicializara la clase estuviera como parametro el path para poner en la creacion, espero que sea esto lo que pedian, sino seria muy facil cambiarlo.
        }
    
    checkFile() {
        if (fs.existsSync(this.path)) {
            const fileContent = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(fileContent);
        }
        else {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, '/t'), 'utf-8');

        }
    } 

    returnId() {
        //Agregue esto para decidir la id del producto ya que con ahora que se pueden eliminar productos con el contador podia darse que se repitieran ids
        if (this.products.length == 0) {
            return 1;
        }
        else {
            let maxId = null;
            this.products.forEach(p => {
                if (!maxId || p.id > maxId) {
                    maxId = p.id;
                }
            });
            return maxId+1;
        }
    }
    addProduct(product) {
// Valida que todos los campos esten y si coincide el codigo con uno ya existente tira un console.error con el error pertinente, originalmente iba a usar throw new Error pero detenia la ejecucion del codigo en su totalidad y supuse que no era lo que se queria
// Puse los errores en ingles porque como en una parte de la consigna pedia devolver un "not found" supuse que la idea era que el codigo estuviera en ingles    
    
    this.checkFile();
    
    if (!product.title) {
            console.error("The title is required");
        }
        else if (!product.description) {
            console.error("Description is required");
        }
        else if (!product.price) {
            console.error("Price is required");
        }
        else if (!product.thumbnail) {
            console.error("The image path is required");
        }
        else if (!product.code) {
            console.error("The product code is required");
        }
        else if (!product.stock) {
            console.error("The product stock is required");
        }
        else if (this.products.some(p => p.code === product.code)) {
            console.error("A product with the same code already exists");
        }
        else{
            // Agrega el producto con un id autoincrementable
            this.products.push({
                id: this.returnId(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
            });
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, '/t'), 'utf-8');
        }
    }
getProducts(limit){
    this.checkFile();
    const numericLimit = parseInt(limit);
    if (limit){
        return this.products.slice(0,numericLimit);
    }
    else{
        console.log(this.products)
        return this.products;
    }
}
getProductById(id) {
    this.checkFile();
    const productid = parseInt(id);
    const product = this.products.find(p => p.id === productid);
    if (!product) {
        console.error("Not found");
        return 'Product not found';
    }
    else {
        console.log(`Product found: ${JSON.stringify(product, null, '/t')}`)
        return product;
    }
    }

deleteProduct(id) {
    this.checkFile();
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex == -1) {
        console.error("The product you want to delete does not exist");
    }
    else {
        this.products.splice(productIndex, 1);
        console.log(`Product deleted`)
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '/t'), 'utf-8');
    }
}
updateProduct(id,product) {
    this.checkFile();
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex == -1) {
        console.error("The product you want to update does not exist");
    }
    else {
        this.products[productIndex] = {
            id: id,
            title: product.title ?? this.products[productIndex].title,
            description: product.description ?? this.products[productIndex].description,
            price: product.price ?? this.products[productIndex].price,
            thumbnail: product.thumbnail ?? this.products[productIndex].thumbnail,
            code: product.code ?? this.products[productIndex].code,
            stock: product.stock ?? this.products[productIndex].stock,
        }
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '/t'), 'utf-8');
        console.log("Product updated")
    }
}
}
