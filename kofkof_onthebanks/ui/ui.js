var SelectedItem = null;
var InputAmount = 0;
var InputPage = false;
$(document).ready(function(){
    var ItemGrabbed = null;
    var PlaceItemGrabbed = false;
    var SlotsUsed = []
    var EmptySlotsToDelete = []
    var lastmouseover = null;
    var ListOfItems = []
    var OtherInvs = []
    var ActualInventory = "playerInv"
    var PlayerItemsInv = []
    var ListOfTotalItems = []
    var ItemsWithoutIds = []
    var PlayerMoney = 0
    window.addEventListener( 'message', function( event ) {
        var data = event.data;
        if(data.showPlayerMenu == "DashBoard"){
            ItemsWithoutIds = []
            var items = data.PlayerInfo.items;
            if (data.PlayerInfo.money > 0) {
                var moneydata = {name: "money", label: "Money", column: 1, row: 1, amount: data.PlayerInfo.money};
                ItemsWithoutIds.push(moneydata);
                PlayerMoney = data.PlayerInfo.money
            }
            if (items != undefined && items != null) {
                PlayerItemsInv = items
            }
            
            LoadInvetory(items);
            ResetTabs()
            var TrunkInv = data.TrunkInv;
            if (TrunkInv != null && TrunkInv != undefined) 
                PrepareOtherInv(TrunkInv)

            var ShopInv = data.ShopInv;
            if (ShopInv != null && ShopInv != undefined) 
                PrepareOtherInv(ShopInv)

            $('body').css('display','block');
        }else if ( data.showPlayerMenu == "Close" ) { // Hide the menu
            $('body').css('display','none');
        }else if ( data.showPlayerMenu == "DelItem" ) { // Hide the menu
            $('#Item_'+ SelectedItem.id).remove();
            SelectedItem = null;
        }else if ( data.showPlayerMenu == "SetHealth" ) { // Hide the menu
            $("#Vida").css("width", data.Vida + "%");
            $("#Armour").css("width", data.Armour + "%");
        }else if ( data.showPlayerMenu == "RemoveMoney" ) { // Hide the menu
            if (SelectedItem != null) {
                SelectedItem.amount = SelectedItem.amount - InputAmount
                $("#"+ SelectedItem.id +"_amount").html(SelectedItem.amount + "€");
                SelectedItem = null;
            }
        }else if ( data.showPlayerMenu == "UpdateShop" ) { // Hide the menu
            $.each(OtherInvs, function(index, Inv) {
                if (Inv.id == data.Shop.id) {
                    Inv.items = data.Shop.items;
                }
            })
        }
    } );
    
    //LoadInvetory([{"id":-1,"label":"Bat","column":1,"row":3,"name":"weapon_bat"},{"id":-1,"label":"Pistol","column":2,"row":1,"name":"weapon_pistol"}])

    $(document).keyup(function(e) {
        if ( e.keyCode == 27 ) {
            if (InputPage == true) {
                InputPage = false;
                $("#InputAmount").css("width", "0vw")
                $("#InputAmount").css("height", "0vh")
                $("#InputAmount").css("opacity", "0")
            }else{
                $("#GrabbedItem").remove();
                ItemGrabbed = null;
                PlaceItemGrabbed = false;
                SlotsUsed = []
                EmptySlotsToDelete = []
                lastmouseover = null;
                ListOfItems = []
                OtherInvs = []
                ActualInventory = "playerInv"
                PlayerItemsInv = []
                SubMenuX = 0;
                SubMenuY = 0;
                SelectedItem = null
                DoubleClick = false;
                CloseLeftClickMenu();
                $.post('http://kofkof_onthebanks/close', JSON.stringify({}));2
            }
        }
    });
    


    var SubMenuX = 0;
    var SubMenuY = 0;
    var DoubleClick = false;
    $('#InventorySpace').on('mouseup', '.Slot', function (ev) {		 
        ev.preventDefault();
        if(ev.which == 3 && this.id.includes("empty") != true)
        {  
            CloseLeftClickMenu()
            if (DoubleClick != undefined && ActualInventory == "playerInv") {
                var SubMenu = document.getElementById("SubMenu");
                var itemData = $(this).data("item");
                SelectedItem = itemData
                var nomeitem = itemData.name
                if (nomeitem.includes("WEAPON_") == true || nomeitem.includes("weapon_") == true) {
                    $("#SubMenu").append(
                        '<p class="useMenu" onmouseup="UseClick()" style="margin-top: 10%;font-size: 0.7vw;">USE</p>'+
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p class="dropMenu" onmouseup="DropClick()" style="margin-top: 7px;font-size: 0.7vw;">DROP</p>'+
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p class="giveMenu" onmouseup="GiveClick()" style="margin-top: 7px;font-size: 0.7vw;">GIVE</p>'
                    )
                    /* $("#SubMenu").css("height", "14.2vh")
                    $("#SubMenu").append(
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p id="ammoMenu" onmouseup="AmmoClick()" style="margin-top: 7px;font-size: 0.7vw;">AMMO</p>'+
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p id="ammoMenu" onmouseup="OpenAttachPage()" style="margin-top: 7px;font-size: 0.7vw;">ATTACH</p>'
                    ) */
                }else if (nomeitem == "money"){
                    $("#SubMenu").css("height", "2.7vh")
                    $("#SubMenu").append(
                        '<p class="giveMenu" onmouseup="GiveClick()" style="margin-top: 7px;font-size: 0.7vw;">GIVE</p>'
                    )
                }else{
                    $("#SubMenu").append(
                        '<p class="useMenu" onmouseup="UseClick()" style="margin-top: 10%;font-size: 0.7vw;">USE</p>'+
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p class="dropMenu" onmouseup="DropClick()" style="margin-top: 7px;font-size: 0.7vw;">DROP</p>'+
                        '<div style="width: 80%;height: 2px;margin-left: 10%;margin-top: -10%;background-color: rgb(255, 255, 255);border-radius: 7px;"></div>'+
                        '<p class="giveMenu" onmouseup="GiveClick()" style="margin-top: 7px;font-size: 0.7vw;">GIVE</p>'
                    )
                }
                $("#SubMenu").css("opacity", "1")
                $("#SubMenu").css("top", ev.clientY)
                $("#SubMenu").css("left", ev.clientX)
                SubMenuX = ev.clientX;
                SubMenuY = ev.clientY;
                //draggingItem = this;
            }else {
                DoubleClick = false;
                $("#GrabbedItem").remove();
                $(ItemGrabbed).css("display", "block");
                ItemGrabbed = null;
                if (lastmouseover != null) {
                    $(lastmouseover).css("background-color", "transparent");
                    lastmouseover = null;
                }
            }
        }else if(ev.which == 3 && this.id.includes("empty") == true) {
            if (DoubleClick == undefined) {
                CloseLeftClickMenu()
                DoubleClick = false;
                $("#GrabbedItem").remove();
                $(ItemGrabbed).css("display", "block");
                ItemGrabbed = null;
                if (lastmouseover != null) {
                    $(lastmouseover).css("background-color", "transparent");
                    lastmouseover = null;
                }
            }
        }else if (ev.which == 1 && this.id.includes("empty") != true) {
            if (DoubleClick == undefined) {
                DoubleClick = false;
                $("#GrabbedItem").remove();
                $(ItemGrabbed).css("display", "block");
                ItemGrabbed = null;
                if (lastmouseover != null) {
                    $(lastmouseover).css("background-color", "transparent");
                    lastmouseover = null;
                }
                
            }else if (DoubleClick == false) {
                DoubleClick = true
                setTimeout(() => {
                    if (DoubleClick == true) {
                        DoubleClick = false
                    }
                }, 500);
            }else if (DoubleClick == true) {   
                DoubleClick = undefined     
                ItemGrabbed = this;   
                var GrabbedSlot = ItemGrabbed.id.split("_");
                GrabbedSlot = parseInt(GrabbedSlot[1]);  
                var ItemGrabbedSize = document.getElementById(this.id);
                var itemdata = $(this).data("item");
                GlobalGrabItem = itemdata
                GlobalGrabInv = ActualInventory
                $(".DownSpace").append('<canvas id="GrabbedItem" style="width: '+ ItemGrabbedSize.offsetWidth +'px; height: '+ ItemGrabbedSize.offsetHeight +'px; background-color: rgba(46, 48, 49, 0.6); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; position: absolute; border: rgba(40, 40, 40, 1) solid 2px;"></canvas>')
                $(this).css("display", "none");
                $("#GrabbedItem").css("top", ev.clientY + 10)
                $("#GrabbedItem").css("left", ev.clientX + 10)
                if (itemdata.column == 1) {
                    const number = SlotsUsed.indexOf(GrabbedSlot);
                    if (number > -1) {
                        SlotsUsed.splice(number, 1);
                    }
                    var ColumnNow = 0;
                    var RowNow = 1;
                    for (var checkslot = 1; checkslot <= GrabbedSlot; checkslot++) {
                        ColumnNow++;
                        if (ColumnNow > 15) {
                            ColumnNow = 1;
                            RowNow++;
                        }
                    }  
                    if (ColumnNow == 0) {
                        $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ (ColumnNow + 1) +'/'+ (ColumnNow + 2) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                    } else {
                        $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ ColumnNow +'/'+ (ColumnNow + 1) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                    }
                    var ItemData = {name: "", label: "", column: 1, row: 1}
                    $("#Item_"+ (GrabbedSlot) +"_empty").data("item", ItemData); 
                    if (itemdata.row > 1) {
                        for (var rowcount = 1; rowcount < itemdata.row; rowcount++) {
                            const number = SlotsUsed.indexOf((GrabbedSlot + (15 * rowcount)));
                            if (number > -1) {
                                SlotsUsed.splice(number, 1);
                                var ColumnNow = 0;
                                var RowNow = 1;
                                for (var checkslot = 1; checkslot <= (GrabbedSlot + (15 * rowcount)); checkslot++) {
                                    ColumnNow++;
                                    if (ColumnNow > 15) {
                                        ColumnNow = 1;
                                        RowNow++;
                                    }
                                }  
                                if (ColumnNow == 0) {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + (15 * rowcount)) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ (ColumnNow + 1) +'/'+ (ColumnNow + 2) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                                } else {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + (15 * rowcount)) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ ColumnNow +'/'+ (ColumnNow + 1) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                                }
                                var ItemData = {name: "", label: "", column: 1, row: 1}
                                $("#Item_"+ (GrabbedSlot + (15 * rowcount)) +"_empty").data("item", ItemData);     
                            }
                        }
                    }
                }else if (itemdata.column > 1) {
                    for (var v = 0; v < itemdata.column; v++) {
                        const number = SlotsUsed.indexOf((GrabbedSlot + v));
                        if (number > -1) {
                            SlotsUsed.splice(number, 1);
                        }
                        var ColumnNow = 0;
                        var RowNow = 1;
                        for (var checkslot = 1; checkslot <= (GrabbedSlot + v); checkslot++) {
                            ColumnNow++;
                            if (ColumnNow > 15) {
                                ColumnNow = 1;
                                RowNow++;
                            }
                        }  
                        if (ColumnNow == 0) {
                            $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + v) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ (ColumnNow + 1) +'/'+ (ColumnNow + 2) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                        } else {
                            $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + v) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ ColumnNow +'/'+ (ColumnNow + 1) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                        }
                        var ItemData = {name: "", label: "", column: 1, row: 1}
                        $("#Item_"+ (GrabbedSlot + v) +"_empty").data("item", ItemData);     
                        var tempelement = document.getElementById("Item_"+ (GrabbedSlot + v) +"_empty")
                        if (itemdata.row > 1) {
                            for (var rowcount = 1; rowcount < itemdata.row; rowcount++) {
                                const number = SlotsUsed.indexOf((GrabbedSlot + v + (15 * rowcount)));
                                if (number > -1) {
                                    SlotsUsed.splice(number, 1);
                                }

                                var ColumnNow = 0;
                                var RowNow = 1;
                                for (var checkslot = 1; checkslot <= (GrabbedSlot + v + (15 * rowcount)); checkslot++) {
                                    ColumnNow++;
                                    if (ColumnNow > 15) {
                                        ColumnNow = 1;
                                        RowNow++;
                                    }
                                }  
                                if (ColumnNow == 0) {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + v + (15 * rowcount)) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ (ColumnNow + 1) +'/'+ (ColumnNow + 2) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                                } else {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ (GrabbedSlot + v + (15 * rowcount)) +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ ColumnNow +'/'+ (ColumnNow + 1) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                                }
                                var ItemData = {name: "", label: "", column: 1, row: 1}
                                $("#Item_"+ (GrabbedSlot + v + (15 * rowcount)) +"_empty").data("item", ItemData);    
                                var tempelement = document.getElementById("Item_"+ (GrabbedSlot + v + (15 * rowcount)) +"_empty")
                            }
                        }
                        
                    }
                }

            }
        }else if (ev.which == 1 && this.id.includes("empty") == true) {
            if (DoubleClick == undefined) {
                if (PlaceItemGrabbed == true) {
                    PlaceItemGrabbed = false;
                    DoubleClick = false;
                    if (ActualInventory != "playerInv" && ActualInventory.type == "shop") {

                    }else{
                        if (GlobalGrabInv.type == "shop") {
                            var itemdata = GlobalGrabItem;
                            if (parseInt(itemdata.price) <= PlayerMoney){
                                PlayerMoney = PlayerMoney - parseInt(itemdata.price)
                                $("#GrabbedItem").remove();
                                var GrabbedSlot = ItemGrabbed.id.split("_");
                                GrabbedSlot = parseInt(GrabbedSlot[1]);
                                if (GlobalGrabInv == ActualInventory) {
                                    $("#"+ ItemGrabbed.id +"").remove();
                                }
                                
                                $.each(EmptySlotsToDelete, function(index, value) {
                                    const number = SlotsUsed.indexOf(value);
                                    if (number > -1) {
                                        SlotsUsed.splice(number, 1);
                                    }
                                    SlotsUsed.push(value);
                                    $("#Item_"+ value +"_empty").remove();
                                })
            
                                var ColumnNow = 0;
                                var RowNow = 1;
                                for (var checkslot = 1; checkslot <= EmptySlotsToDelete[0]; checkslot++) {
                                    ColumnNow++;
                                    if (ColumnNow > 15) {
                                        ColumnNow = 1;
                                        RowNow++;
                                    }
                                }
            
                                
                                var PlacedSlot = this.id.split("_");
                                PlacedSlot = parseInt(PlacedSlot[1]);
                                itemdata.id = PlacedSlot
                                if (ColumnNow == 0) {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.6); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ (ColumnNow + 1) +'/'+ ((ColumnNow + 1) + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"></div>');
                                }else if(itemdata.name == "money"){
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.8); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"><p id="'+ PlacedSlot +'_amount" style="font-size: 0.6vw;float: left;padding-left: 0.1vw;color: #86C232;background: transparent;padding-right: 0.1vw; margin: 0px">'+ itemdata.amount +'€</p></div>');
                                } else {
                                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.6); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"></div>');
                                }
                                $("#Item_"+ PlacedSlot +"").data("item", itemdata); 
                               
                                EmptySlotsToDelete = []
                                $(ItemGrabbed).remove();
                                $(this).css("background", "transparent");
                            }else{
                                $("#GrabbedItem").remove();
                                $(ItemGrabbed).remove();
                                $(this).css("background", "transparent");
                            }
                        }else{
                            $("#GrabbedItem").remove();
                            var GrabbedSlot = ItemGrabbed.id.split("_");
                            GrabbedSlot = parseInt(GrabbedSlot[1]);
                            var itemdata = GlobalGrabItem;
                            if (GlobalGrabInv == ActualInventory) {
                                $("#"+ ItemGrabbed.id +"").remove();
                            }
                            
                            
                            $.each(EmptySlotsToDelete, function(index, value) {
                                const number = SlotsUsed.indexOf(value);
                                if (number > -1) {
                                    SlotsUsed.splice(number, 1);
                                }
                                SlotsUsed.push(value);
                                $("#Item_"+ value +"_empty").remove();
                            })
        
                            var ColumnNow = 0;
                            var RowNow = 1;
                            for (var checkslot = 1; checkslot <= EmptySlotsToDelete[0]; checkslot++) {
                                ColumnNow++;
                                if (ColumnNow > 15) {
                                    ColumnNow = 1;
                                    RowNow++;
                                }
                            }
        
                            
                            var PlacedSlot = this.id.split("_");
                            PlacedSlot = parseInt(PlacedSlot[1]);
                            itemdata.id = PlacedSlot
                            if (ColumnNow == 0) {
                                $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.6); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ (ColumnNow + 1) +'/'+ ((ColumnNow + 1) + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"></div>');
                            }else if(itemdata.name == "money"){
                                $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.8); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"><p id="'+ PlacedSlot +'_amount" style="font-size: 0.6vw;float: left;padding-left: 0.1vw;color: #86C232;background: transparent;padding-right: 0.1vw; margin: 0px">'+ itemdata.amount +'€</p></div>');
                            } else {
                                $("#InventorySpace").append('<div class="Slot" id="Item_'+ PlacedSlot +'" style="background-color: rgba(46, 48, 49, 0.6); background-position: center; background-image: url(\'./ITEMS/'+ itemdata.name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + itemdata.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + itemdata.row) +'"></div>');
                            }
                            $("#Item_"+ PlacedSlot +"").data("item", itemdata); 
                        
                            EmptySlotsToDelete = []
                            $(ItemGrabbed).remove();
                            $(this).css("background", "transparent");
                        }

                        
                        
                        if (GlobalGrabInv == ActualInventory) {
                            $.post('http://kofkof_onthebanks/changeItemData', JSON.stringify({
                                newid: itemdata.id,
                                inv: ActualInventory,
                                oldid: GrabbedSlot
                            }));
        
                            if (ActualInventory == "playerInv") {
                                $.each(PlayerItemsInv, function(index, value) {
                                    if (value.id == GrabbedSlot){
                                        value.id = itemdata.id;
                                    }
                                })
                            }else{
                                $.each( OtherInvs, function( index, Inv ) {
                                    if (Inv.id == ActualInventory.id) {
                                        $.each(ActualInventory.items, function(index, value) {
                                            if (value.id == GrabbedSlot){
                                                value.id = itemdata.id;
                                            }
                                        })
                                        ActualInventory = Inv;
                                    }
                                });
                            }
                        }else{
                            if (ActualInventory == "playerInv") {
                                if (GlobalGrabInv.type == "shop") {
                                    if (parseInt(itemdata.price) <= PlayerMoney){
                                        $.post('http://kofkof_onthebanks/BuyItems', JSON.stringify({
                                            amount: itemdata.price,
                                            item: itemdata.name
                                        }));2

                                        if (itemdata.price != null) {
                                            itemdata.price = null
                                        }
                                        
                                        PlayerItemsInv.push(itemdata);
                                        $.post('http://kofkof_onthebanks/UpdateItemsList', JSON.stringify({
                                            Items: PlayerItemsInv
                                        }));2
                                        
                                    }
                                }else{
                                    var IndexToDel = 0
                                    var IdGrabbed = GlobalGrabItem.id
                                    console.log(IdGrabbed)
                                    $.each(OtherInvs, function(index, Inv) {
                                        if (Inv.id == GlobalGrabInv.id && Inv.type != "shop") {
                                            $.each(Inv.items, function(index, value) {
                                                if (value.id == IdGrabbed){
                                                    console.log("Deleted Trunk")
                                                    IndexToDel = index;
                                                }
                                            })
                                            Inv.items.splice(IndexToDel, 1);
                                            $.post('http://kofkof_onthebanks/UpdateSecondItemsList', JSON.stringify({
                                                Inv: Inv
                                            }));2
                                        }
                                    })
                                    
                                    console.log("Added Player")
                                    PlayerItemsInv.push(itemdata);
        
                                    $.post('http://kofkof_onthebanks/UpdateItemsList', JSON.stringify({
                                        Items: PlayerItemsInv
                                    }));2
                                }
                                
                            }else{
                                var IndexToDel = 9999
                                var IdGrabbed = GlobalGrabItem.id
                                console.log(IdGrabbed)
                                $.each(PlayerItemsInv, function(index, value) {
                                    if (value.id == IdGrabbed){
                                        console.log("Deleted Player")
                                        IndexToDel = index;
                                    }
                                })
                                PlayerItemsInv.splice(IndexToDel, 1)
                                   
    
                                $.each(OtherInvs, function(index, Inv) {
                                    if (Inv.id == ActualInventory.id) {
                                        console.log("Added Trunk")
                                        Inv.items.push(itemdata);
                                    }
                                })
    
                                $.post('http://kofkof_onthebanks/UpdateItemsList', JSON.stringify({
                                    Items: PlayerItemsInv
                                }));2

                                $.post('http://kofkof_onthebanks/UpdateSecondItemsList', JSON.stringify({
                                    Inv: ActualInventory
                                }));2
    
                            }
                        }
                    }
                    
                    
                }
            }
        }
    }); 

    $('#InventorySpace').on('mousedown', function (ev) {		 
        ev.preventDefault();
        if (ev.which == 1) {
            CloseLeftClickMenu();
        }
    }); 


    document.onmousemove = function(e){
        if (DoubleClick == undefined) {
            $("#GrabbedItem").css("top", e.pageY + 10)
            $("#GrabbedItem").css("left", e.pageX + 10)
        }
    }
    var GlobalGrabItem = null
    var GlobalGrabInv = null
    $('#InventorySpace').on('mouseover', '.Slot', function (ev) {	
        ev.preventDefault();
        
        if (DoubleClick == undefined && this.id.includes("empty") != true) {
            $(this).css("background-color", "rgba(252, 3, 3, 0.5)");
            PlaceItemGrabbed = false;
            lastmouseover = this;
        }else if (DoubleClick == undefined && this.id.includes("empty") == true) {
            $(this).css("background-color", "#86C232");
            var EmptySlot = this.id.split("_");
            EmptySlot = parseInt(EmptySlot[1]);
            var GrabbedSlot = ItemGrabbed.id.split("_");
            GrabbedSlot = parseInt(GrabbedSlot[1]);
            var itemdata = GlobalGrabItem;

            var notoverlap = true;
            EmptySlotsToDelete = [];
            EmptySlotsToDelete.push(EmptySlot);
            if (itemdata.column > 1) {
                for (var v = 1; v < itemdata.column; v++) {
                    var checkempty = $("#Item_"+ (EmptySlot + v) +"_empty")[0]
                    if (checkempty == null || checkempty == undefined) {
                        notoverlap = false;
                    } else {
                        EmptySlotsToDelete.push((EmptySlot + v));
                    }
    
                    if (itemdata.row > 1) {
                        for (var rowcount = 1; rowcount < itemdata.row; rowcount++) {
                            var checkempty = $("#Item_"+ (EmptySlot + (v - 1) + (15 * rowcount)) +"_empty")[0]
                            if (checkempty == null || checkempty == undefined) {
                                notoverlap = false;
                            } else {
                                EmptySlotsToDelete.push((EmptySlot + (v - 1) + (15 * rowcount)));
                            }
                        }
                    }
                    
                }
            }else if (itemdata.column == 1){
                if (itemdata.row > 1) {
                    for (var rowcount = 1; rowcount < itemdata.row; rowcount++) {
                        var checkempty = $("#Item_"+ (EmptySlot + (15 * rowcount)) +"_empty")[0]
                        if (checkempty == null || checkempty == undefined) {
                            notoverlap = false;
                        } else {
                            EmptySlotsToDelete.push((EmptySlot + (15 * rowcount)));
                        }
                    }
                }
            }
            
            PlaceItemGrabbed = notoverlap;
            lastmouseover = this;

        }
    }); 

    $('#InventorySpace').on('mouseout', '.Slot', function (ev) {		 
        ev.preventDefault();
        
        if (DoubleClick == undefined && this.id.includes("empty") != true) {
            $(this).css("background-color", "rgba(46, 48, 49, 0.6)");
        }else if(DoubleClick == undefined && this.id.includes("empty") == true){
            $(this).css("background-color", "transparent");
        }
    }); 

 
    function SetSlotsReady(List) {
        var ItemsList = List;
        var RowNow = 1;
        var ColumnNow = 1;
        var DeleteSlots = []
        var removelistslots = []
        var SetIdElem = 0;
        var totalItems = [];
        var IdsToChange = []
        $.each( ItemsList, function( i, a ) {
            if (ItemsList[i].price != null){
                a.id = 1
                var ItemData = a
                $("#InventorySpace").append('<div class="Slot" id="Insert_'+ i +'" style="background-color: rgba(46, 48, 49, 0.8); background-position: center; background-image: url(\'./ITEMS/'+ ItemsList[i].name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: 1/'+ (ColumnNow + ItemsList[i].column) +'; grid-row: 1/'+ (RowNow + ItemsList[i].row) +'"><p style="font-size: 0.6vw;float: left;padding-left: 0.1vw;color: #86C232;background: transparent;padding-right: 0.1vw; margin: 0px">'+ ItemsList[i].price +'€</p></div>');
                $("#Insert_"+ i +"").data("item", ItemData);
            }else if(a.name == "money"){
                a.id = 1
                var ItemData = a
                $("#InventorySpace").append('<div class="Slot" id="Insert_'+ i +'" style="background-color: rgba(46, 48, 49, 0.8); background-position: center; background-image: url(\'./ITEMS/'+ ItemsList[i].name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: 1/'+ (ColumnNow + ItemsList[i].column) +'; grid-row: 1/'+ (RowNow + ItemsList[i].row) +'"><p id="'+ i +'_amount" style="font-size: 0.6vw;float: left;padding-left: 0.1vw;color: #86C232;background: transparent;padding-right: 0.1vw; margin: 0px">'+ ItemsList[i].amount +'€</p></div>');
                $("#Insert_"+ i +"").data("item", ItemData);
            }else{
                a.id = 1
                var ItemData = a
                $("#InventorySpace").append('<div class="Slot" id="Insert_'+ i +'" style="background-color: rgba(46, 48, 49, 0.8); background-position: center; background-image: url(\'./ITEMS/'+ ItemsList[i].name +'.png\'); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: 1/'+ (ColumnNow + ItemsList[i].column) +'; grid-row: 1/'+ (RowNow + ItemsList[i].row) +'"></div>');
                $("#Insert_"+ i +"").data("item", ItemData);
            }
            
            var CanPlace = false
            var InvFull = false
            while (CanPlace == false && InvFull == false) {
                var BreakException = {};
                try {
                    if (SlotsUsed.length == 0) {
                        CanPlace = true;
                    }else {
                        $.each( SlotsUsed, function( index, value ) {
                            var overlap = CheckOverlap(SlotsUsed, ColumnNow, RowNow, i, ItemsList);
                            var TotalRow = ColumnNow + ItemsList[i].column - 1;
                            if (overlap == true && TotalRow <= 15) {
                                CanPlace = true;
                            }else if(overlap == false && TotalRow >= 15){
                                ColumnNow = 1;
                                RowNow = RowNow + 1;
                                var tempColumn =  "" + ColumnNow +"/"+ (ColumnNow + ItemsList[i].column) + "";
                                var tempRow =  "" + RowNow +"/"+ (RowNow + ItemsList[i].row) + "";
                                $("#Insert_"+ i +"").css("grid-column", tempColumn);
                                $("#Insert_"+ i +"").css("grid-row", tempRow);
                                CanPlace = false;
                                var CheckRow = RowNow + ItemsList[i].row - 1
    
                                if (CheckRow >= 13) {
                                    InvFull = true;
                                    $("#Insert_"+ i +"").css("display", "none");
                                    DeleteSlots.push(i);
                                    for (var v = 0; v < ItemsList[i].column; v++) {
                                        if (RowNow > 1) {
                                            removelistslots.push((ColumnNow + v + (15 * (RowNow - 1))));
                                        }else{
                                            removelistslots.push((ColumnNow + v));
                                        }
    
                                        if (ItemsList[i].row > 1) {
                                            for (var rowcount = 1; rowcount < ItemsList[i].row; rowcount++) {
                                                var RowSlotNumber = (ColumnNow + v + (15 * (RowNow - 1))) + (15 * rowcount); // 1 + (15 * 1) = 16 || 2 + (15 * 1) = 17 || 3 + (15 * 1) = 18
                                                removelistslots.push(RowSlotNumber);
                                            }
                                        }
                                    }
                                }
                                throw BreakException;
                            }else if (overlap == false){
                                ColumnNow = ColumnNow + 1;
                                var tempColumn =  "" + ColumnNow +"/"+ (ColumnNow + ItemsList[i].column) + "";
                                var tempRow =  "" + RowNow +"/"+ (RowNow + ItemsList[i].row) + "";
                                $("#Insert_"+ i +"").css("grid-column", tempColumn);
                                $("#Insert_"+ i +"").css("grid-row", tempRow);
                                CanPlace = false;
                                throw BreakException;
                            }
                            if (overlap == false) {
                                CanPlace = false;
                            }
                        });
                    }
                    
                } catch (e) {
                    if (e !== BreakException) throw e;
                }
            }
            

            
            for (var v = 0; v < ItemsList[i].column; v++) {
                if (RowNow > 1) {
                    SlotsUsed.push((ColumnNow + v + (15 * (RowNow - 1))));
                }else{
                    SlotsUsed.push((ColumnNow + v));
                }
                
                if (ItemsList[i].row > 1) {
                    for (var rowcount = 1; rowcount < ItemsList[i].row; rowcount++) {
                        var RowSlotNumber = (ColumnNow + v + (15 * (RowNow - 1))) + (15 * rowcount); // 1 + (15 * 1) = 16 || 2 + (15 * 1) = 17 || 3 + (15 * 1) = 18
                        SlotsUsed.push(RowSlotNumber);
                    }
                }
            }

            SetIdElem = (15 * RowNow - (15 - ColumnNow))
            ItemData.id = SetIdElem;
            ItemsList[i] = ItemData;
            IdsToChange.push({SetIdElem, i});
            ColumnNow = 1;
            RowNow = 1;
            
        });

        for (var deleted = 0; deleted <= DeleteSlots.length; deleted++) {
            $("#Insert_"+ DeleteSlots[deleted] +"").remove();
        }

        $.each(removelistslots, function(index, value) {
            const number = SlotsUsed.indexOf(value);
            if (number > -1) {
                SlotsUsed.splice(number, 1);
            }
        })

        $.each(IdsToChange, function(index, value) {
            $("#Insert_"+ value.i).attr("id", "Item_" + value.SetIdElem);
            $("#"+ value.i + "_amount").attr("id", "" + value.SetIdElem + "_amount");
        })

        $.each(ItemsList, function(index, value) {
            if (value.name != "money"){
                ListOfTotalItems.push(value);
            }
        })
        
        if (ActualInventory == "playerInv") {
            $.post('http://kofkof_onthebanks/UpdateItemsList', JSON.stringify({
                Items: ListOfTotalItems
            }));2
            PlayerItemsInv = ListOfTotalItems;
        }else{
            ActualInventory.items = ListOfTotalItems;
            if (ActualInventory.type != "shop"){
                $.post('http://kofkof_onthebanks/UpdateSecondItemsList', JSON.stringify({
                    Inv: ActualInventory
                }));2
            }
            
        }
        ListOfTotalItems = []
        ColumnNow = 1;
        RowNow = 1;

        PlaceEmptySlots()
    }

    function PlaceEmptySlots() {
        var ColumnNow = 1;
        var RowNow = 1;
        for (var checkslot = 1; checkslot <= 180; checkslot++) {
            var CanPlace = true
            $.each( SlotsUsed, function( vv, UsedSlot ) {
                if (checkslot == UsedSlot) {
                   CanPlace = false
                }
            });
            if (CanPlace == true) {
                $("#InventorySpace").append('<div class="Slot" id="Item_'+ checkslot +'_empty" style="background-color: transparent; width: 100%; height: 100%; grid-column: '+ ColumnNow +'/'+ (ColumnNow + 1) +'; grid-row: '+ RowNow +'/'+ (RowNow + 1) +'"></div>');
                var ItemData = {name: "", label: "", column: 1, row: 1}
                $("#Item_"+ checkslot +"_empty").data("item", ItemData);
            }
            ColumnNow++;
            if (ColumnNow > 15) {
                ColumnNow = 1;
                RowNow++;
            }
        }
    }

    function LoadInvetory(List) {
        $("#InventorySpace").html("");
        $.each( List, function( index, item ) {
            if (item != undefined && item != null && item.id != undefined && item.id != null && item.id >= 0) {
                var ColumnNow = 0;
                var RowNow = 1;
                for (var checkslot = 1; checkslot <= item.id; checkslot++) {
                    ColumnNow++;
                    if (ColumnNow > 15) {
                        ColumnNow = 1;
                        RowNow++;
                    }
                }
                if (item.price != null){
                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ item.id +'" style="background-position: center; background-image: url(\'./ITEMS/'+ item.name +'.png\'); background-color: rgba(46, 48, 49, 0.8); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + item.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + item.row) +'"><p style="font-size: 0.6vw;float: left;padding-left: 0.1vw;color: #86C232;background: transparent;padding-right: 0.1vw; margin: 0px">'+ item.price +'€</p></div>');
                    var ItemData = item
                    $("#Item_"+ item.id).data("item", ItemData);
                }else{
                    $("#InventorySpace").append('<div class="Slot" id="Item_'+ item.id +'" style="background-position: center; background-image: url(\'./ITEMS/'+ item.name +'.png\'); background-color: rgba(46, 48, 49, 0.8); background-repeat: no-repeat; background-size: contain; width: 100%; height: 100%; border: rgba(40, 40, 40, 1) solid 2px; grid-column: '+ ColumnNow +'/'+ (ColumnNow + item.column) +'; grid-row: '+ RowNow +'/'+ (RowNow + item.row) +'"></div>');
                    var ItemData = item
                    $("#Item_"+ item.id).data("item", ItemData);
                }
                
                

                for (var v = 0; v < item.column; v++) {
                    if (RowNow > 1) {
                        SlotsUsed.push((ColumnNow + v + (15 * (RowNow - 1))));
                    }else{
                        SlotsUsed.push((ColumnNow + v));
                    }
                    
                    if (item.row > 1) {
                        for (var rowcount = 1; rowcount < item.row; rowcount++) {
                            var RowSlotNumber = (ColumnNow + v + (15 * (RowNow - 1))) + (15 * rowcount); // 1 + (15 * 1) = 16 || 2 + (15 * 1) = 17 || 3 + (15 * 1) = 18
                            SlotsUsed.push(RowSlotNumber);
                        }
                    }
                }
            } else if (item != undefined && item != null) {
                ItemsWithoutIds.push(item);
                
            }
        });
        if (ItemsWithoutIds.length > 0) {
            $.each(ItemsWithoutIds, function(index, item) {
                const number = List.indexOf(item);
                if (number > -1) {
                    List.splice(number, 1);
                }
                
            })
            ListOfTotalItems = List;
            SetSlotsReady(ItemsWithoutIds);
        }else {
            PlaceEmptySlots()
        }
        
    }


    function CheckOverlap(SlotsUsed, index, rowcounts, i , ItemsList) {
        var notoverlap = true;
        var UnCheckedSlots = [];

        for (var v = 0; v < ItemsList[i].column; v++) {
            if (rowcounts > 1) {
                UnCheckedSlots.push((index + v + (15 * (rowcounts - 1))));
            }else{
                UnCheckedSlots.push((index + v));
            }
            
            if (ItemsList[i].row > 1) {
                for (var rowcount = 1; rowcount < ItemsList[i].row; rowcount++) {
                    var RowSlotNumber = (index + v + (15 * (rowcounts - 1))) + (15 * rowcount); // 1 + (15 * 1) = 16 || 2 + (15 * 1) = 17 || 3 + (15 * 1) = 18
                    UnCheckedSlots.push(RowSlotNumber);
                }
            }
        }

        for (var v = 0; v < UnCheckedSlots.length; v++) {
            $.each( SlotsUsed, function( vv, UsedSlot ) {
                if (UnCheckedSlots[v] == UsedSlot) {
                    notoverlap = false
                }
            });
        }
        
        return notoverlap;
    }

    function compararNumeros(a, b) {
        return a - b;
    }



    

    function PrepareOtherInv(Inv) {
        if (Inv.type == "trunk") {
            $("#InvsTabs").append(
                '<div id="'+ Inv.id +'" class="tab" style="width: 100%;height: 5%;background-color: #3e610e;margin-top: 5%;">' +
                    '<i class="fas fa-car" aria-hidden="true" style="font-size: 1.6vw;margin-top: 19%;margin-left: 9%;color: #2e3031;"></i>' +
                '</div>'
            )
            OtherInvs.push(Inv);
        }

        if (Inv.type == "shop") {
            $("#InvsTabs").append(
                '<div id="'+ Inv.id +'" class="tab" style="width: 100%;height: 5%;background-color: #3e610e;margin-top: 5%;">' +
                    '<i class="fas fa-store" aria-hidden="true" style="font-size: 1.3vw;margin-top: 23%;margin-left: 11%;color: #2e3031;"></i>' +
                '</div>'
            )
            OtherInvs.push(Inv);
        }
    }

    function ResetTabs() {
        $("#InvsTabs").html("")
        $("#InvsTabs").append(
            '<div id="playerInv" class="tab" style="width: 100%; height: 5%; background-color: #86C232;">'+
                '<i class="fas fa-male" aria-hidden="true" style="font-size: 1.9vw; margin-top: 11%; margin-left: 30%; color: #2e3031;"></i>'+
            '</div>'
        )
    }

    function OpenOtherInv(id) {
        ItemsWithoutIds = []
        $("#InventorySpace").html("");
        if (ActualInventory != "playerInv"){
            $("#" + ActualInventory.id).css("background-color", "#3e610e")
        }else{
            $("#" + ActualInventory).css("background-color", "#3e610e")
        }
        
        if (id == "playerInv") {
            ActualInventory = "playerInv";
            $("#" + ActualInventory).css("background-color", "#86C232")
            SlotsUsed = []
            if (PlayerMoney > 0) {
                var moneydata = {name: "money", label: "Money", column: 1, row: 1, amount: PlayerMoney};
                ItemsWithoutIds.push(moneydata);
            }
            LoadInvetory(PlayerItemsInv);
        }else{
            $.each( OtherInvs, function( index, Inv ) {
                if (Inv.id == id) {
                    ActualInventory = Inv;
                    $("#" + ActualInventory.id).css("background-color", "#86C232")
                    SlotsUsed = []
                    LoadInvetory(Inv.items);
                }
            });
        }
        
    }

    $('#InvsTabs').on('mouseup', '.tab', function (ev) {	
        OpenOtherInv(this.id);
        CloseLeftClickMenu()
    });

})


function UseClick() {
    if (SelectedItem.can_remove == 1) {
        $("#Item_" + SelectedItem.id).remove()
    }
    $.post('http://kofkof_onthebanks/UseItem', JSON.stringify({
        item: SelectedItem
    }));2
    CloseLeftClickMenu()
    
}

function DropClick() {
    $("#Item_" + SelectedItem.id).remove()
    $.post('http://kofkof_onthebanks/DropItem', JSON.stringify({
        item: SelectedItem
    }));2
    CloseLeftClickMenu()
}

function GiveClick() {
    if (SelectedItem.name == "money" && InputPage == false){
        $("#InputAmount").css("width", "100vw")
        $("#InputAmount").css("height", "100vh")
        $("#InputAmount").css("opacity", "1")
        InputPage = true
    }else if (SelectedItem.name == "money" && InputAmount > 0) {
        InputPage = false;
        if (SelectedItem.amount == InputAmount) {
            $("#Item_" + SelectedItem.id).remove();
            $.post('http://kofkof_onthebanks/GiveMoney', JSON.stringify({
                qty: InputAmount,
            }));2
            SelectedItem = null;
        }else if (SelectedItem.amount > InputAmount) {
            $.post('http://kofkof_onthebanks/GiveMoney', JSON.stringify({
                qty: InputAmount,
            }));2
        }
        
        CloseLeftClickMenu()
        InputAmount = 0;
        $("#Quantity").val("");
    }else{
        $.post('http://kofkof_onthebanks/GiveItem', JSON.stringify({
            item: SelectedItem
        }));2
        CloseLeftClickMenu()
    }
    
}

function ConfirmInput() {
    InputAmount = parseInt($("#Quantity").val());
    $("#InputAmount").css("width", "0vw")
    $("#InputAmount").css("height", "0vh")
    $("#InputAmount").css("opacity", "0")
    GiveClick()
}

function CloseLeftClickMenu() {
    $("#SubMenu").css("opacity", "0")
    $("#SubMenu").css("top", 0)
    $("#SubMenu").css("left", 0)
    $("#SubMenu").css("height", "8.4vh")
    $("#SubMenu").html("")
}