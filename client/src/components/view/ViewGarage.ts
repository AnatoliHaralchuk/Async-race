export class ViewGarage {
    drawSetControl(){
        return `
        <div class="set-control">
            <form action="#" class="set-create form">
                <input type="text" class="create-name input" name="name">
                <input type="color" value="#000000" class="create-color color" name="name">
                <button type="submit" class="create-btn btn">Create</button>
            </form>
            <form action="#" class="set-update form">
                <input type="text" class="update-name input" name="name">
                <input type="color" value="#000000" class="update-color color" name="name">
                <button type="submit" class="update-btn btn">Update</button>
            </form>
        </div>`
    }
    drawRaceControl(){
        return `            
        <div class="race-control">
            <button class="race-btn button">Race</button>
            <button class="reset-btn button">Reset</button>
            <button class="generate-btn button">Generate Cars</button>
        </div>`
    }
}
