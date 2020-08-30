-------------------------------------------------
-- CONFIG:
local Using_ESX = true
local Using_VRP = false
-------------------------------------------------

-------------------------------------------------
-- ESX:
ESX = nil
if Using_ESX == true then
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
end
-------------------------------------------------


-------------------------------------------------
-- Indice:
-- | PrintCoords
-- | CheckPlayerDBF
-- | SendRoleToTarget
-- | RefreshPlayersData
-- | GetPlayerLicensse
-- | AddPlayerItemF
-------------------------------------------------

local PlayersJoined = {}

-- [PrintCoords]
RegisterNetEvent("kofkof:SendCoordsPrint")
AddEventHandler('kofkof:SendCoordsPrint', function(Coords)
    local text = "{ x = "..Coords.x..", y = "..Coords.y..", z = "..Coords.z..", h = "..Coords.h.." }"
    print(text)
end)
------------

-- [CheckPlayerDBF]
RegisterNetEvent("kofkof:CheckPlayerDB")
AddEventHandler('kofkof:CheckPlayerDB', function(source)
    local license  = GetLicensse(source) 
    if Using_ESX == true then
        MySQL.Async.fetchAll("SELECT * FROM users", {}, function(player)  
            local PlayerData = {}
            for _,PlayerRow in pairs(player) do
                if PlayerRow.license == license then
                    PlayerRow.items = json.decode(PlayerRow.items)
                    PlayerData = PlayerRow
                    TriggerClientEvent("kofkof:applyplayerdata", source, PlayerData)
                end
            end

            local AlreadyJoined = false
            for _, playerJ in pairs(PlayersJoined) do
                if playerJ.license == license then
                    AlreadyJoined = true
                    playerJ = PlayerData
                end
            end

            if AlreadyJoined == false then
                table.insert(PlayersJoined, PlayerData)
            end
            
        end)

        

        MySQL.Async.fetchAll("SELECT * FROM items", {}, function(itemsdb)  
            local items = {}
            for _,item in pairs(itemsdb) do
                Citizen.Wait(10)
                local ItemData = {}
                if string.find(item.name, "weapon_") then
                    ItemData = {id = -1, name = item.name, label = item.label, column = item.column, row = item.row, type = "item_weapon", can_remove = item.can_remove}
                else
                    ItemData = {id = -1, name = item.name, label = item.label, column = item.column, row = item.row, type = "item_standard", can_remove = item.can_remove}
                end
                table.insert(items, ItemData)
            end
            TriggerClientEvent("kofkof:applyitemdata", source, items)
        end)
        
    else
        MySQL.Async.fetchAll("SELECT * FROM users", {}, function(player)  
            local PlayerFound = false
            local PlayerData = {money = 0, bank = 0, items =  "{}", license = license}
            for _,PlayerRow in pairs(player) do
                if PlayerRow.license == license then
                    PlayerFound = true 
                    PlayerRow.items = json.decode(PlayerRow.items)
                    PlayerData = PlayerRow
                end
            end
            if PlayerFound == false then
                MySQL.Async.execute('INSERT INTO users (li) VALUES (@li)',
                {
                    ['@li']   = license
                }, function (rowsChanged)
                    
                end)
            end

            local AlreadyJoined = false
            for _, playerJ in pairs(PlayersJoined) do
                if playerJ["li"] == license then
                    AlreadyJoined = true
                end
            end

            if AlreadyJoined == false then
                table.insert(PlayersJoined, PlayerData)
            end
            TriggerClientEvent("kofkof:applyplayerdata", source, PlayerData)
        end)
    end
end)
------------

-- [GetMoneyF]
ESX.RegisterServerCallback("kofkof:getplayermoney", function(source, cb)
	local src = source
	local xPlayer = ESX.GetPlayerFromId(src)
	
	
	cb(xPlayer.getMoney())
end)
------------

-- [RefreshPlayersData]
Citizen.CreateThread(function()
    while true do 
        Citizen.Wait(60000)
        for _, Player in pairs(PlayersJoined) do
            local items = json.encode(Player.items)
            MySQL.Async.execute("UPDATE users SET items = @items WHERE license = @li",
                {
                    ['@li'] = Player.license,
                    ['@items'] = items,
                }
            )
        end
    end
end)
------------

-- [GetPlayerLicensse]
function GetLicensse(source) 
    for k,v in pairs(GetPlayerIdentifiers(source))do
        if string.sub(v, 1, string.len("license:")) == "license:" then
            license = v
            return license
        end
    end
end
------------


-- [AddPlayerItemF]
RegisterNetEvent("kofkof:addplayeritem")
AddEventHandler('kofkof:addplayeritem', function(source, item, countitem)
    local license = GetLicensse(source)

    for _, Player in pairs(PlayersJoined) do
        if license == Player.license then
            table.insert(Player.items, item)
        end
    end

    if Using_ESX == true then
        local xPlayer = ESX.GetPlayerFromId(source)
        local itemesx    = item.name
        print(itemesx)
        xPlayer.addInventoryItem(itemesx, countitem)
    end
end)
------------


-- [BonesFunction]
local damagedParts = {}

RegisterServerEvent('kofkof:storeDamage')
AddEventHandler('kofkof:storeDamage', function(parts, id)
  damagedParts[id] = parts
end)

RegisterServerEvent('kofkof:sendDamage')
AddEventHandler('kofkof:sendDamage', function(source)
  local _source = source
  TriggerClientEvent('kofkof:receiveDamage', _source, damagedParts)
end)

------------

-- [UPDATEITEMSF]
RegisterNetEvent("kofkof:UpdateItems")
AddEventHandler('kofkof:UpdateItems', function(source, items)
    local license = GetLicensse(source)

    for _, Player in pairs(PlayersJoined) do
        if license == Player.license then
            Player.items = items
        end
    end
end)
------------

-- [UPDATESECONDITEMSF]
RegisterNetEvent("kofkof:UpdateSecondItems")
AddEventHandler('kofkof:UpdateSecondItems', function(source, inv)
    MySQL.Async.execute("UPDATE other_inv SET items = @items WHERE id = @id",
        {
            ['@id'] = inv.id,
            ['@items'] = json.encode(inv.items),
        }
    )
end)
------------


-- [RegisterUseItemTriggerEvent]
RegisterNetEvent("kofkof:UseItem")
------------


-- [TrunkInv]
RegisterNetEvent("kofkof:GetTrunkInv")
AddEventHandler('kofkof:GetTrunkInv', function(plate, source)
    MySQL.Async.fetchAll("SELECT * FROM other_inv where type = 'trunk'", {}, function(other)  
        local TrunkFound = false
        local TrunkData = {id = plate, items = json.decode("[]"), type = "trunk"}
        for _,InvRow in pairs(other) do
            if InvRow.id == plate then
                TrunkFound = true 
                InvRow.items = json.decode(InvRow.items)
                TrunkData = InvRow
            end
		end
        if TrunkFound == false then
            MySQL.Async.execute('INSERT INTO other_inv (id, type, items) VALUES (@id, @type, @items)',
            {
                ['@id']   = plate,
                ['@type']   = "trunk",
                ['@items']   = "{}"
            }, function (rowsChanged)
            end)
        end
        TriggerClientEvent("kofkof:OpenInvWithTrunk", source, TrunkData)
	end)
end)
------------

-- [AddPlayerItemF]
RegisterNetEvent("kofkof:GivePlayerItem")
AddEventHandler('kofkof:GivePlayerItem', function(source, item)
    local license = GetLicensse(source)

    for _, Player in pairs(PlayersJoined) do
        if license == Player.license then
            table.insert(Player.items, item)
            TriggerClientEvent("kofkof:applyplayerdata", source, Player)
        end
    end

    
end)
------------

-- [GiveMoneyF]
RegisterNetEvent("kofkof:GivePlayerMoney")
AddEventHandler('kofkof:GivePlayerMoney', function(amount, tsource)
	local src = source
	local xPlayer = ESX.GetPlayerFromId(src)
	local tPlayer = ESX.GetPlayerFromId(tsource)
    local money = tonumber(amount)
	xPlayer.removeMoney(money)
	tPlayer.addMoney(money)
end)
------------

-- [RemoveMoney]
RegisterNetEvent("kofkof:TakeMoney")
AddEventHandler('kofkof:TakeMoney', function(amount, tsource, itemname)
	local src = source
	local xPlayer = ESX.GetPlayerFromId(tsource)
    local money = tonumber(amount)
    xPlayer.removeMoney(money)
    if string.match(itemname, "WEAPON_") then
        
    elseif string.match(itemname, "weapon_") then
        
    else
        xPlayer.addInventoryItem(itemname, 1)
    end
	
end)
------------