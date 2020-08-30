Config = {}
Config.Using_ESX = true
Config.Using_VRP = false
Config.OpenTrunkKey = 74 -- 74 = H || https://docs.fivem.net/docs/game-references/controls/
Config.OpenInvKey = 289 -- 74 = H || https://docs.fivem.net/docs/game-references/controls/
Config.Shops = {
    { 
        id = "ShopNormal1", -- Change for everyshop
        
        x = 25.730501174927, y = -1347.7794189453, z = 29.49702835083,
      
        items = {
            {id = -1, name = "bread", label = "Bread", column = 1, row = 1, type = "item_standard", price = 1, can_remove = 1},
            {id = -1, name = "water", label = "Water", column = 1, row = 1, type = "item_standard", price = 2, can_remove = 1},
            {id = -1, name = "medikit", label = "Medic kit", column = 1, row = 2, type = "item_standard", price = 20, can_remove = 1}, 
            {id = -1, name = "weapon_pistol", label = "Pistol", column = 2, row = 1, type = "item_weapon", price = 2000, can_remove = 0, ammo = 10, serial = 0}
        },
        
        type = "shop" -- Dont Change! even if it is a weapon shop
    }
}

Config.AllItems = { -- types: item_money, item_weapon, item_standard and item_account

}

-------------------------------------------------
-- ADD TO ES_EXTENDED/SERVER/MAIN.LUA:473 (Normaly at that line) | TriggerClientEvent('kofkof:AddItemInv', _source, pickup.name, total)
-------------------------------------------------
