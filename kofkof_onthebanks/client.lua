
-------------------------------------------------
-- ESX:
ESX = nil

Citizen.CreateThread(function()
    if Config.Using_ESX == true then
        while ESX == nil do
            TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
            Citizen.Wait(0)
        end

        while ESX.GetPlayerData().job == nil do
            Citizen.Wait(100)
        end

        ESX.PlayerData = ESX.GetPlayerData()
    end
end)
-------------------------------------------------


-------------------------------------------------
-- Indice:
-- | SpawnPED
-- | CreateBlips
-- | LeaveMap
-- | TpWaipoint
-- | TpCoords
-- | UnFreeze
-- | SaveCoordsF
-- | OnPlayerSpawnF
-- | ApplyPlayerDataF
-- | CheckMyInfoAdmin
-- | GivePermissionsF
-- | GiveItemsF
-- | OpenandCloseHtmlF
-- | CameraFunctions
-- | BonesShowing
-- | 3DTextDisplay
-- | ChangeItemIDF
-- | UpdateAllItems
-- | UseItemF
-- | DropItemF
-- | GiveItemF
-- | OpenCarTrunk

-------------------------------------------------



local MyInfo = {}

RegisterCommand("myid", function(s, args, rawCommand)
    print(GetPlayerServerId(PlayerId()))
end)

--[[ -- [CreateBlips]
function CreateBlipF()
    local blipm = AddBlipForCoord(ExtractPoints[1].x, ExtractPoints[1].y, ExtractPoints[1].z)
            
    SetBlipSprite (blipm, 515)
    SetBlipDisplay(blipm, 4)
    SetBlipScale  (blipm, 0.8)
    SetBlipColour (blipm, 2)
    SetBlipAsShortRange(blipm, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("Extract Point")
    EndTextCommandSetBlipName(blipm)
end
------------ ]]

--[[ 
-- [TpWaipoint]
RegisterCommand("tpm", function()
    local WaypointHandle = GetFirstBlipInfoId(8)

    if DoesBlipExist(WaypointHandle) then
        local waypointCoords = GetBlipInfoIdCoord(WaypointHandle)
        for height = 1, 1000 do
            SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords.x, waypointCoords.y, height + 0.0)

            local foundGround, zPos = GetGroundZFor_3dCoord(waypointCoords.x, waypointCoords.y, height + 0.0)

            if foundGround then
                SetPedCoordsKeepVehicle(PlayerPedId(), waypointCoords.x, waypointCoords.y, height + 0.0)

                break
            end

            Citizen.Wait(10)
        end
        TriggerServerEvent("kofkof:addnotifyserver","check", "Teleported <b><span style='color: green;'>successfully</span>.", 5000)
    end
end)
------------ ]]


-- [SaveCoordsF]
RegisterCommand("savecoordss", function()
    local PedCoords = GetEntityCoords(GetPlayerPed(-1))
    local heading = GetEntityHeading(GetPlayerPed(-1))
    local totaldata = {x = PedCoords.x, y = PedCoords.y, z = PedCoords.z, h = heading }
    TriggerServerEvent("kofkof:SendCoordsPrint", totaldata)
end)
------------

-- [TpCoords]
RegisterCommand("tpc", function(s, args, rawCommand)
    if MyInfo.group == "superadmin" then
        local Ped = GetPlayerPed(-1)
        local x = args[1] + 0.0
        local y = args[2] + 0.0
        local z = args[3] + 0.0
        SetEntityCoords(Ped, x, y, z, 0, 0, 0, false)
        TriggerServerEvent("kofkof:addnotifyserver","check", "Teleported <b><span style='color: green;'>successfully</span>.", 5000)
    else
        TriggerServerEvent("kofkof:addnotifyserver","cancel", "You dont have <b><span style='color: red'>permissions</span></b> to do that command.", 5000)
    end
end)
------------

-- [OnPlayerSpawnF]
Citizen.CreateThread(function()
    TriggerServerEvent("kofkof:CheckPlayerDB", GetPlayerServerId(PlayerId()))
end)
------------

-- [ApplyPlayerDataF]
RegisterNetEvent('kofkof:applyplayerdata')
AddEventHandler('kofkof:applyplayerdata', function(PlayerData)
	MyInfo = PlayerData
end)
------------

-- [ApplyItemDataF]
RegisterNetEvent('kofkof:applyitemdata')
AddEventHandler('kofkof:applyitemdata', function(Items)
	Config.AllItems = Items
end)
------------


-- [GiveItemsF]
RegisterCommand("givekofitem", function(s, args, rawCommand)
    if MyInfo.group == "superadmin" then
        local targetid = args[1]
        local itemname = args[2]
        local itemqty = tonumber(args[3])
        local InfoItem = {}
        local founditem = false
        for _, item in pairs(Config.AllItems) do
            if itemname == item.name then
                InfoItem = item
                founditem = true
            end
        end
        if itemqty == nil or itemqty == 0 then
            itemqty = 1
        end
        if itemname ~= nil or itemname ~= "" then
            if founditem == true then 
                local ped = GetPlayerPed(-1)
                if string.match(itemname, "WEAPON_") then
                    local serialnumber = math.random(111111111, 999999999)
                    if itemqty > 250 then
                        itemqty = 250
                    end
                    local WeaponData = {column = InfoItem.column, id = -1, label = InfoItem.label, name = InfoItem.name, can_remove = InfoItem.can_remove, type = "item_weapon", row = InfoItem.row, ammo = itemqty, serial = serialnumber}
                    InfoItem = WeaponData
                elseif string.match(itemname, "weapon_") then
                    local serialnumber = math.random(111111111, 999999999)
                    if itemqty > 250 then
                        itemqty = 250
                    end
                    local WeaponData = {column = InfoItem.column, id = -1, label = InfoItem.label, name = InfoItem.name, can_remove = InfoItem.can_remove, type = "item_weapon", row = InfoItem.row, ammo = itemqty, serial = serialnumber}
                    InfoItem = WeaponData
                end
                
                local ped = GetPlayerPed(-1)
                if string.match(itemname, "WEAPON_") then
                    table.insert(MyInfo.items, InfoItem)
                    if not HasPedGotWeapon(ped, GetHashKey(itemname), false) then
                        GiveWeaponToPed(ped, GetHashKey(itemname), itemqty, false, false)
                    end
                elseif string.match(itemname, "weapon_") then
                    table.insert(MyInfo.items, InfoItem)
                    if not HasPedGotWeapon(ped, GetHashKey(itemname), false) then
                        GiveWeaponToPed(ped, GetHashKey(itemname), itemqty, false, false)
                    end
                else
                    local i = 0
                    while i < itemqty do
                        i = i + 1
                        table.insert(MyInfo.items, InfoItem)
                    end
                end
                TriggerServerEvent("kofkof:addplayeritem", targetid, InfoItem, itemqty)
                TriggerServerEvent("kofkof:addnotifyserver","check", "You gave <b>"..itemqty.."x ".. InfoItem.label .."</b> to the player number <b>"..targetid.."</b>.", 5000)
            else
                TriggerServerEvent("kofkof:addnotifyserver","cancel", "There is no item called <b><span style='color: red'>"..itemname.."</span></b>.", 5000)
            end
        end
    else
        TriggerServerEvent("kofkof:addnotifyserver","cancel", "You dont have <b><span style='color: red'>permissions</span></b> to do that command.", 5000)
    end
end)
------------



-- [OpenandCloseHtmlF]
local HTMLopened = false
Citizen.CreateThread(function()
    while true do 
        Citizen.Wait(1)
        if IsControlJustReleased(0, Config.OpenInvKey) then
            if HTMLopened == false then 
                HTMLopened = true
                Citizen.Wait(100)
                if not IsPedInAnyVehicle(GetPlayerPed(-1)) then
                    CreateSkinCam()
                end
                SetNuiFocus( true, true )
                KeyPressed(true)
                TriggerServerEvent('kofkof:sendDamage', GetPlayerServerId(PlayerId()))
                if Config.Using_ESX == true then
                    ESX.TriggerServerCallback("kofkof:getplayermoney",function(money)
                        MyInfo.money = money
                        SendNUIMessage({
                            showPlayerMenu = "DashBoard",
                            PlayerInfo = MyInfo,
                        })
                    end)
                end
            end
        end
    end
end)

RegisterNUICallback('close', function(data, cb)
    DeleteSkinCam()
    KeyPressed(false)
    HTMLopened = false
    SetNuiFocus( false, false )
    SendNUIMessage({
        showPlayerMenu = "Close",
    })
    cb('ok')
end)

RegisterCommand("closeui", function(s, args, rawCommand)
    DeleteSkinCam()
    KeyPressed(false) 
    HTMLopened = false
    SetNuiFocus( false, false )
    SendNUIMessage({
        showPlayerMenu = "Close",
    })
end)

------------


-- [CameraFunctions]
local cam = nil
local isCameraActive = false
local zoomOffset, camOffset, heading = 1.7, -0.1, 0.0
function CreateSkinCam()
    if not DoesCamExist(cam) then
        cam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
    end

    local playerPed = PlayerPedId()

    SetCamActive(cam, true)
    RenderScriptCams(true, true, 500, true, true)

    isCameraActive = true
    SetCamRot(cam, 0.0, 0.0, 270.0, true)
    SetEntityHeading(playerPed, 0.0)
end

function DeleteSkinCam()
    isCameraActive = false
    SetCamActive(cam, false)
    RenderScriptCams(false, true, 500, true, true)
    cam = nil
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)

        if isCameraActive then
            DisableControlAction(2, 30, true)
            DisableControlAction(2, 31, true)
            DisableControlAction(2, 32, true)
            DisableControlAction(2, 33, true)
            DisableControlAction(2, 34, true)
            DisableControlAction(2, 35, true)
            DisableControlAction(0, 25, true) -- Input Aim
            DisableControlAction(0, 24, true) -- Input Attack

            local playerPed = PlayerPedId()
            local coords    = GetEntityCoords(playerPed)

            local angle = heading * math.pi / 180.0
            local theta = {
                x = math.cos(angle),
                y = math.sin(angle)
            }

            local pos = {
                x = coords.x + (zoomOffset * theta.x),
                y = coords.y + (zoomOffset * theta.y)
            }

            local angleToLook = heading - 140.0
            if angleToLook > 360 then
                angleToLook = angleToLook - 360
            elseif angleToLook < 0 then
                angleToLook = angleToLook + 360
            end

            angleToLook = angleToLook * math.pi / 180.0
            local thetaToLook = {
                x = math.cos(angleToLook),
                y = math.sin(angleToLook)
            }

            local posToLook = {
                x = coords.x + (zoomOffset * thetaToLook.x),
                y = coords.y + (zoomOffset * thetaToLook.y)
            }

            SetCamCoord(cam, pos.x, pos.y, coords.z + camOffset)
            PointCamAtCoord(cam, posToLook.x, posToLook.y, coords.z + camOffset)
        else
            Citizen.Wait(500)
        end
    end
end)

Citizen.CreateThread(function()
    local angle = 90

    while true do
        Citizen.Wait(0)

        if isCameraActive then
            if IsControlPressed(0, 108) then
                angle = angle - 1
            elseif IsControlPressed(0, 109) then
                angle = angle + 1
            end

            if angle > 360 then
                angle = angle - 360
            elseif angle < 0 then
                angle = angle + 360
            end

            heading = angle + 0.0
        else
            Citizen.Wait(500)
        end
    end
end)

------------


-- [BonesShowing]
local lastBone = nil
local damagedParts = {}
local keyPressed = false
local nearDamage = {}
local elements = {
    ['arms'] = {2992, 5232, 6286, 18905, 22711, 28252, 28422, 36029, 37119, 40269, 43810, 45509, 57005, 60309, 61007, 61163},
    ['legs'] = {2108, 6442, 14201, 16335, 20781, 20781, 23639, 24806, 35502, 36864, 46078, 51826, 52301, 56604, 57717, 58271, 58331, 63931, 65245},
    ['head'] = {1356, 11174, 12844, 17188, 17719, 19336, 20279, 20623, 21550, 25260, 27474, 29868, 31086, 35731, 37193, 39317, 46240, 47419, 47495, 49979, 61839, 65068},
    ['body'] = {10706, 11816, 23553, 24816, 24817, 24818, 57597, 64729},
}
  
local parts = {
    ['eyebrow'] = 1356,
    ['left toe'] = 2108,
    ['right elbow'] = 2992,
    ['left arm'] = 5232,
    ['right hand'] = 6286,
    ['right thigh'] = 6442,
    ['right collarbone'] = 10706,
    ['right corner of the mouth'] = 11174,
    ['sinks'] = 11816,
    ['head'] = 12844,
    ['left foot'] =  14201,
    ['right knee'] = 16335,
    ['lower lip'] = 17188,
    ['lip'] = 17719,
    ['left hand'] = 18905,
    ['right cheekbone'] = 19336,
    ['right toe'] = 20781,
    ['nerve of the lower lip']  = 20279,
    ['lower lip'] = 20623,
    ['toe']	= 20781,
    ['left cheekbone'] = 21550,
    ['left elbow'] = 22711,
    ['spinal root'] = 23553,
    ['left thigh'] = 23639,
    ['right foot'] = 24806,
    ['lower part of the spine'] = 24816,
    ['the middle part of the spine'] = 24817,
    ['the upper part of the spine'] = 24818,
    ['left eye'] = 25260,
    ['rifht eye'] = 27474,
    ['right arm'] = 28252,
    ['right hand'] = 28422,
    ['left corner of the mouth'] = 29868,
    ['head'] = 31086,
    ['right foot'] = 35502,
    ['neck'] = 35731,
    ['left hand'] = 36029,
    ['right calf'] = 36864,
    ['right arm'] = 37119,
    ['eyebrow'] = 37193,
    ['neck'] = 39317,
    ['right arm'] = 40269,
    ['right forearm'] = 43810,
    ['left shoulder'] = 45509,
    ['left knee'] = 46078,
    ['jaw'] = 46240,
    ['nerve of the lower lip'] = 47419,
    ['tongue'] = 47495,
    ['nerve of the upper lip'] = 49979,
    ['right thigh'] = 51826,
    ['right foot'] = 52301,
    ['root'] = 56604,
    ['right hand'] = 57005,
    ['spine'] = 57597,
    ['left foot bone'] = 57717,
    ['left thigh'] = 58271,
    ['left eyebrow'] = 58331,
    ['left hand bone'] = 60309,
    ['left hand'] = 18905,
    ['right forearm'] = 61007,
    ['left forearm'] = 61163,
    ['upper lip'] = 61839,
    ['left calf'] = 63931,
    ['left collarbone'] = 64729,
    ['face'] = 65068,
    ['left foot'] = 65245,
}
  

function KeyPressed(valor) 
    keyPressed = valor
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(100)
        local FoundLastDamagedBone, LastDamagedBone = GetPedLastDamageBone(PlayerPedId())
        if FoundLastDamagedBone and LastDamagedBone ~= lastBone then
            local DamagedBone = getBoneName(LastDamagedBone)
            if DamagedBone then
                TriggerEvent('kofkof:storeBones', LastDamagedBone, GetPlayerServerId(PlayerId()))
                Citizen.Wait(0)
                lastBone = LastDamagedBone
            end
        end
    end
end)

Citizen.CreateThread(function()
  while true do
    Citizen.Wait(0)
    if keyPressed then
      for player, parts in pairs(nearDamage) do
        for k, part in pairs(parts) do
          local ped = GetPlayerPed(player)
          local pos, x, y, z = GetPedBoneCoords(ped, part.value, 0.10, 0, 0)
          local color = {r = 255, g = 255, b = 255}
          if part.count * 25 >= 50 then
            color = {r = 253, g = 106, b = 2}
          end
          if part.count * 25 >= 75 then
            color = {r = 237, g = 41, b = 57}
          end
          if part.count * 25 >= 100 then
            color = {r = 124, g = 10, b = 2}
          end
          DrawText3D(pos.x, pos.y, pos.z, '['.. part.count * 25 ..'%]', color)
        end
      end
    end
  end
end)

Citizen.CreateThread(function()
  local ped = GetPlayerPed(-1)
  while true do
    Citizen.Wait(0)
    for k, part in pairs(damagedParts) do
        while part.count * 25 >= 100 and not IsEntityDead(ped) do
          local boneName = getBoneName(part.value)
          local currentHealth = GetEntityHealth(ped)
          SetEntityHealth(ped, 0)
          damagedParts = {}
          Citizen.Wait(5000)
        end
    end
  end
end)


Citizen.CreateThread(function()
    while true do
      Citizen.Wait(500)
      if IsEntityDead(GetPlayerPed(-1)) then
        TriggerServerEvent('kofkof:storeDamage', {}, PlayerId())
        damagedParts = {}
      end
    end
end)


RegisterNetEvent('kofkof:storeBones')
AddEventHandler('kofkof:storeBones', function(bone)
  local currentCount = getDamagedCount(bone)
  if currentCount == 0 then
    table.insert(damagedParts, {value = bone, count = 1})
  else
    addDamagedCount(bone)
  end
  local id = PlayerId()
  TriggerServerEvent('kofkof:storeDamage', damagedParts, id)
end)

RegisterNetEvent('kofkof:receiveDamage')
AddEventHandler('kofkof:receiveDamage', function(damagedPlayers)
  nearDamage = {}
  for player, parts in pairs(damagedPlayers) do
    local ped = GetPlayerPed(-1)
    local ped2 = GetPlayerPed(player)
    local playerCoords = GetEntityCoords(ped)
    local playerCoords2 = GetEntityCoords(ped2)

    if(Vdist( playerCoords.x, playerCoords.y, playerCoords.z, playerCoords2.x, playerCoords2.y, playerCoords2.z) < 1.5)then
      nearDamage[player] = parts
    end
  end
end)

function getBoneName(boneId)
    for Key, Value in pairs(parts) do
        if boneId == Value then
            return Key
        end
    end
    return nil
end

function getBonePart(boneId)
    for element, Value in pairs(elements) do
        for k, Value in pairs(Value) do
            return element
        end
    end
    return nil
end

function getDamagedCount(part)
  for k, currentPart in pairs(damagedParts) do
    if currentPart.value == part then
      return currentPart.count
    end
  end
  return 0
end

function addDamagedCount(part, color)
  for k, currentPart in pairs(damagedParts) do
    if currentPart.value == part then
      currentPart.count = currentPart.count + 1
      break
    end
  end
end

------------


-- [3DTextDisplay]
function DrawText3D(x,y,z, text, color) -- some useful function, use it if you want!
    local onScreen,_x,_y=World3dToScreen2d(x,y,z)
    local px,py,pz=table.unpack(GetGameplayCamCoords())
    local dist = GetDistanceBetweenCoords(px,py,pz, x,y,z, 1)
  
    local scale = (1/dist)*2
    local fov = (1/GetGameplayCamFov())*100
    local scale = scale*fov
  
    if onScreen then
        SetTextScale(0.0*scale, 0.20*scale)
        SetTextFont(0)
        SetTextProportional(1)
        -- SetTextScale(0.0, 0.55)
        SetTextColour(color.r, color.b, color.g, 255)
        SetTextDropshadow(0, 0, 0, 0, 255)
        SetTextEdge(2, 0, 0, 0, 150)
        SetTextDropShadow()
        SetTextOutline()
        SetTextEntry("STRING")
        SetTextCentre(1)
        AddTextComponentString(text)
        DrawText(_x,_y)
    end
end
------------


-- [ChangeItemIDF]
RegisterNUICallback('changeItemData', function(data, cb)
    if data.inv == "playerInv" then
        for _, item in pairs(MyInfo.items) do 
            if item.id == data.oldid then
                item.id = data.newid
            end
        end
        TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
    else
        for _, item in pairs(data.inv.items) do 
            if item.id == data.oldid then
                item.id = data.newid
            end
        end
        TriggerServerEvent("kofkof:UpdateSecondItems", GetPlayerServerId(PlayerId()), data.inv)
    end
    
    cb('ok')
end)
------------

-- [UpdateAllItems]
RegisterNUICallback('UpdateItemsList', function(data, cb)
    MyInfo.items = data.Items
    TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), data.Items)
    cb('ok')
end)

RegisterNUICallback('UpdateSecondItemsList', function(data, cb)
    TriggerServerEvent("kofkof:UpdateSecondItems", GetPlayerServerId(PlayerId()), data.Inv)
    cb('ok')
end)
------------


-- [UseItemF]
local WeaponUsing = nil
RegisterNUICallback('UseItem', function(data, cb)
    if Config.Using_ESX == true then
        if data.item.can_remove == 1 then
            local index = 1
            for _, item in pairs(MyInfo.items) do 
                if item.id == data.item.id then
                    break
                end
                index = index + 1
            end
            table.remove(MyInfo.items, index)
            TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
        end
        local ped = GetPlayerPed(-1)
        if string.match(data.item.name, "WEAPON_") then
            WeaponUsing = data.item
            RemoveWeaponFromPed(ped, GetHashKey(data.item.name))
            GiveWeaponToPed(ped, GetHashKey(data.item.name), 0, false, true)
            SetPedAmmo(ped, GetHashKey(data.item.name), data.item.ammo)
            
        elseif string.match(data.item.name, "weapon_") then
            WeaponUsing = data.item
            RemoveWeaponFromPed(ped, GetHashKey(data.item.name))
            GiveWeaponToPed(ped, GetHashKey(data.item.name), 0, false, true)
            SetPedAmmo(ped, GetHashKey(data.item.name), data.item.ammo)
            
        else
            TriggerServerEvent("esx:useItem", data.item.name)
        end
        
        TriggerServerEvent("kofkof:addnotifyserver","check", "You used an item", 5000)
    elseif Config.Using_VRP == true then

    else
        
    end


    cb('ok')
end)
------------

-- [DropItemF]
RegisterNUICallback('DropItem', function(data, cb)
    if Config.Using_ESX == true then
        local index = 1
        for _, item in pairs(MyInfo.items) do 
            if item.id == data.item.id then
                break
            end
            index = index + 1
        end
        table.remove(MyInfo.items, index)
        TriggerServerEvent("kofkof:addnotifyserver","check", "You dropped an item", 5000)
        TriggerServerEvent("esx:removeInventoryItem", data.item.type, data.item.name, 1)
        TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
    elseif Config.Using_VRP == true then

    else
        
    end


    cb('ok')
end)
------------

-- [GiveItemF]
RegisterNUICallback('GiveItem', function(data, cb)
    
    if Config.Using_ESX == true then
        local playerPed = PlayerPedId()
        local player, distance = ESX.Game.GetClosestPlayer()

        if distance ~= -1 and distance <= 3.0 then
            local count = tonumber(1)

            if data.item.type == "item_weapon" then
                count = data.item.ammo
            end
            

            local index = 1
            for _, item in pairs(MyInfo.items) do 
                if item.id == data.item.id then
                    break
                end
                index = index + 1
            end
            table.remove(MyInfo.items, index)
            SendNUIMessage({
                showPlayerMenu = "DelItem",
                itemid = data.item.id,
            })

            TriggerServerEvent("esx:giveInventoryItem", GetPlayerServerId(player), data.item.type, data.item.name, count)
            TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
            data.item.id = -1
            TriggerServerEvent("kofkof:GivePlayerItem", GetPlayerServerId(player), data.item)
        else
            TriggerServerEvent("kofkof:addnotifyserver","cancel", "No players close to you", 5000)
        end
    elseif Config.Using_VRP == true then

    else
        TriggerServerEvent("kofkof:addnotifyserver","cancel", "Item: "..data.item.name..".", 5000)
    end


    cb('ok')
end)
------------


-- [OpenCarTrunk]

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(5)
        local playerPed = GetPlayerPed(-1)
        if not IsPedInAnyVehicle(playerPed) then
            if IsControlJustReleased(0, Config.OpenTrunkKey) then
                local Vehicle = VehicleInFront()


                if Vehicle ~= nil then
                    local VehPlate = GetVehicleNumberPlateText(Vehicle)
                    if VehPlate ~= nil then
                        TriggerServerEvent("kofkof:GetTrunkInv", VehPlate, GetPlayerServerId(PlayerId()))
                    end
                end
            end
        end
    end
end)

RegisterNetEvent('kofkof:OpenInvWithTrunk')
AddEventHandler('kofkof:OpenInvWithTrunk', function(TrunkInv)
    if HTMLopened == false then 
        HTMLopened = true
        Citizen.Wait(100)
        CreateSkinCam()
        SetNuiFocus( true, true )
        KeyPressed(true)
        TriggerServerEvent('kofkof:sendDamage', GetPlayerServerId(PlayerId()))
        SendNUIMessage({
            showPlayerMenu = "DashBoard",
            PlayerInfo = MyInfo,
            TrunkInv = TrunkInv,
        })
    end
end)

function VehicleInFront()
    local pos = GetEntityCoords(GetPlayerPed(-1))
    local entityWorld = GetOffsetFromEntityInWorldCoords(GetPlayerPed(-1), 0.0, 4.0, 0.0)
    local rayHandle = CastRayPointToPoint(pos.x, pos.y, pos.z, entityWorld.x, entityWorld.y, entityWorld.z, 10, GetPlayerPed(-1), 0)
    local a, b, c, d, result = GetRaycastResult(rayHandle)
    return result
end
------------


-- [OpenShopMenu]
local ZmarkerShop = 0.0
local UporDownShop = true
local lastShop = nil
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(5)
        local Ped = GetPlayerPed(-1)
        local PedCoords = GetEntityCoords(Ped)
        
        for _, Shop in pairs(Config.Shops) do 
            local distance = GetDistanceBetweenCoords(PedCoords.x, PedCoords.y, PedCoords.z, Shop.x, Shop.y, Shop.z, true)
            if distance <= 10 then
                if ZmarkerShop < 0.5 and UporDownShop == true then
                    ZmarkerShop = ZmarkerShop + 0.011
                else
                    UporDownShop = false
                end
                
                if ZmarkerShop > 0 and UporDownShop == false then
                    ZmarkerShop = ZmarkerShop - 0.011
                else
                    UporDownShop = true
                end
                DrawMarker(20, Shop.x, Shop.y, Shop.z + ZmarkerShop, 0, 0, 0, 0, 0, 0, 0.5001, 0.5001, 0.5001, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0)
                DrawMarker(27, Shop.x, Shop.y, Shop.z - 0.9, 0, 0, 0, 0, 0, 0, 1.0001, 1.0001, 1.0001, 51, 204, 51, 255, 0, 0, 0, 0, 0, 0, 0)
                if IsControlJustReleased(0, 38) and distance <= 1 then
                    if HTMLopened == false then 
                        HTMLopened = true
                        Citizen.Wait(100)
                        CreateSkinCam()
                        SetNuiFocus( true, true )
                        KeyPressed(true)
                        TriggerServerEvent('kofkof:sendDamage', GetPlayerServerId(PlayerId()))
                        SendNUIMessage({
                            showPlayerMenu = "DashBoard",
                            PlayerInfo = MyInfo,
                            ShopInv = Shop,
                        })
                        lastShop = Shop
                    end
                end
            end
        end
    end
end)
------------

-- [AddItemInv]
RegisterNetEvent('kofkof:AddItemInv')
AddEventHandler('kofkof:AddItemInv', function(itemname, total)
    local InfoItem = {}
    local founditem = false
    for _, item in pairs(Config.AllItems) do
        if itemname == item.name then
            InfoItem = item
            founditem = true
        end
    end
    if founditem == true then
        local i = 0
        while i < total do
            i = i + 1
            table.insert(MyInfo.items, InfoItem)
        end
        TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
    end
end)
------------

-- [SendHtmlHealth]
Citizen.CreateThread(function()
    while true do
        local ped = GetPlayerPed(-1)
        Citizen.Wait(2000)
        local vidaped = GetEntityHealth(ped) -- max: 200
        local armourped = GetPedArmour(ped) -- max: 100
        SendNUIMessage({
            showPlayerMenu = "SetHealth",
            Vida = (vidaped / 2),
            Armour = armourped,
        })

    end
end)
------------

-- [UpdateWeaponAmmo]
local PedShooting = false
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1)
        local playerPed = GetPlayerPed(-1)
        if IsPedArmed(playerPed, 6) then 
            if IsPedShooting(playerPed) then
                WeaponUsing.ammo = WeaponUsing.ammo - 1
                PedShooting = true
            elseif not IsPedShooting(playerPed) and PedShooting == true then
                PedShooting = false
                for _, item in pairs(MyInfo.items) do 
                    if item.serial ~= nil and item.serial == WeaponUsing.serial then
                        item.ammo = WeaponUsing.ammo
                    end
                end
                TriggerServerEvent("kofkof:UpdateItems", GetPlayerServerId(PlayerId()), MyInfo.items)
            end
        end
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1)
        DisableControlAction(0, 37)
    end
end)
------------

-- [GiveMoneyF]
RegisterNUICallback('GiveMoney', function(data, cb)
    if Config.Using_ESX == true then
        local playerPed = PlayerPedId()
        local player, distance = ESX.Game.GetClosestPlayer()

        if distance ~= -1 and distance <= 3.0 then
            SendNUIMessage({
                showPlayerMenu = "RemoveMoney",
            })
            TriggerServerEvent("kofkof:GivePlayerMoney", data.item, GetPlayerServerId(player))
        else
            TriggerServerEvent("kofkof:addnotifyserver","cancel", "No players close to you", 5000)
        end
    elseif Config.Using_VRP == true then

    else
        TriggerServerEvent("kofkof:addnotifyserver","cancel", "Item: "..data.item.name..".", 5000)
    end

    cb('ok')
end)
------------

-- [BuyItem]
RegisterNUICallback('BuyItems', function(data, cb)
    SendNUIMessage({
        showPlayerMenu = "UpdateShop",
        Shop = lastShop,
    })
    TriggerServerEvent("kofkof:TakeMoney", data.amount, GetPlayerServerId(PlayerId()), data.item)
    cb('ok')
end)
------------