# PF2e/SF2e Monster Parts

This module seeks to implement the management and automation of magical items created from defeated enemies.
The intent is to implement Battlezoo Bestiary monster parts system and provide a framework for the creation of custom materials within PF2e system of FoundryVTT.

Full Battlezoo Bestiary rules for Monster parts system are available [here](https://pf2easy.com/index.php?id=19415).

This module supports [adding homebrew monster materials](https://github.com/Cuingamehtar/fvtt-pf2e-monster-parts/wiki/Adding-homebrew-content).

Discuss the module [here](https://discord.com/channels/880968862240239708/1406595957390577774).

This project and its author are not affiliated with Roll For Combat.

## What is this module

This module simplifies use of the Monster Parts subsystem by Roll for Combat in Foundry by automating the following processes:
1. Generating a monster part based on a creatures traits and abilities
2. Using these monster parts to refine and imbue items with special properties, each with separate levels individually tracked
3. Displaying in description and automating the abilities granted by properties imbued into equipment
<img width="726" height="512" alt="image" src="https://github.com/user-attachments/assets/5274ea74-efb1-47de-9597-0815dbf52aad" />
<img width="603" height="529" alt="image" src="https://github.com/user-attachments/assets/6ffcc445-cf68-4ecd-8a7d-0e3620180e55" />

## Current completion status

Please see the [checklist](https://github.com/Cuingamehtar/fvtt-pf2e-monster-parts/blob/master/checklist.md)

## How to use this module

This module can generate monster parts based on the features and traits of the monster you're generating them from. These parts can be edited to add or remove refinements and imbuements as desired. Players can then use those parts to refine and imbue items.

### Creating a monster part

1. Find the creature you want to use, and import them into your Actor library
<img width="589" height="42" alt="image" src="https://github.com/user-attachments/assets/ba234ddc-69da-44e6-96f9-c967621837d9" />

2. On the actor in your library, navigate to their inventory. On the "Treasure" category, there should be a skull icon. Click it.   
    NOTE: If you're using an older version of the module, this icon will be on the Equipment category instead. Otherwise, the following steps are identical.
<img width="652" height="684" alt="image" src="https://github.com/user-attachments/assets/b8f74d46-aa6d-4f82-a98e-aba1979ad3bc" />

3. You now have a monster part item in the actor's inventory. This monster part will come with all possible refinements and imbuements the module can pull from the monster's traits and abilities, however often still needs some editing. For example, all armor refinements are always enabled, when some monsters realistically shouldn't be able to provide parts to make heavy armor with.

   To edit the refinements and imbuements a certain part allows, first click the pencil-and-paper icon to edit the item as usual, then click "edit monster part" on the top right.
<img width="664" height="309" alt="image" src="https://github.com/user-attachments/assets/c966bbe1-8439-4a58-bc0b-25dc0b199a2c" />
<img width="608" height="603" alt="image" src="https://github.com/user-attachments/assets/d46152dc-3737-4bf9-b699-b5842fd43caf" />

From there, you can check or uncheck refinements and imbuements as desired, as well as change the gold value of this particular part.

### Refining an item

To refine an item using this module, first the item itself has to be set up to be refineable. After that is done, the item's level can be increased.

#### Setting up an item to be refined

Note: This requires "Create Items" permissions. By default, that's only enabled for GMs. If you're a player, ask your GM to turn on these permissions for you.

1. Determine which item you want to refine and import it into your Item library, or put it on an actor/token's character sheet. If you're refining a skill item, create a new blank equipment item and use that instead.
2. In your Item library, click "Create Item" at the top, and select "Refined Item".
<img width="341" height="834" alt="image" src="https://github.com/user-attachments/assets/449c99fc-2796-42f7-9c01-38d466978b87" />

3. Drag the to-be-refined item from the character sheet it's on or from your Item library onto the dialogue box that appears. A list of eligible refinements will appear for the item. If you're setting up a skill item, make sure to select the correct skill.
<img width="371" height="275" alt="image" src="https://github.com/user-attachments/assets/7ad50911-44fa-4c64-afdc-74bdc4cdb1ea" />
<img width="400" height="168" alt="image" src="https://github.com/user-attachments/assets/3930f786-21e3-4a34-ba1c-8e17a9cec98e" />

You now have an item that's ready to be receive monster parts to increase its level! The item you turned into a refined item should now have an extra box in its description that says "Refined Item". If you edit the item (pencil-and-paper icon) and click "Edit Refined Item" at the top, you'll see that it'll have a refinement value of whatever its base value is, but negative.

<img width="557" height="551" alt="image" src="https://github.com/user-attachments/assets/e8bddf7e-c54c-47b5-be52-36b2da1ece2c" />

**A note on refining items with a base level higher than 0**

To refine a level 0 dagger, you have to use 2 silver to cover the item's base cost. However, the rules in the Battlezoo books are unclear on how to handle Refining items that have a base level higher than 0, such as some armors or advanced weapons, as well as magic items already existing in the PF2e books. It is up to GM interpretation on how to handle this, but one way to do so is to say that an item hits its original level immediately as soon as its original gold cost has been added to the item. By default, the module looks to the *refined* value of the item to determine its level and completely ignores what level the item had originally. If you use the aforementioned ruling, that means that you'll have to manually set the refined value of the item to the value matching its original level as soon as its original cost to "hit level 0" have been paid.

For example: A set of full plate is level 2 and costs 30 GP. If you generate a refined item with the steps above, you'll get a level 0 set of full plate with value -30GP. I use 30 GP worth of parts to pay off the item's original cost. The item should now immediately be level 2, but the refined value of the item is 0, so the module will set the item's level to 0. To fix this, edit the refined item and set the refined value to be 20 GP, correctly setting this set of full plate's level to 2.

After that is done, the item can be further refined using the following steps normally.

#### Increasing the item's level

1. Click the pencil-and-paper icon to edit this item, then click Edit Refined Item to open the "Edit contained materials" window (see image in step 3 of above)
2. Locate the monster part you want to use, and drag it directly onto the Refinement part of that window. This opens the "Assign Material" window.

<img width="401" height="204" alt="image" src="https://github.com/user-attachments/assets/389654d5-9af9-41b9-ac35-95bfd858fae6" />
<img width="442" height="351" alt="image" src="https://github.com/user-attachments/assets/f99f0a8e-8801-4309-a7cd-af5d3ada9ede" />

3. By default the module will try to consume the full value of the part. In the Assign Material window, you can set how much is consumed manually, or to consume only enough to hit a certain level on the item.

#### Adding Imbued Properties, or increasing an Imbued Property level

1. As above, but drag the monster part you want to use onto the "Imbuement" part of the "Edit contained materials" window instead. If the weapon already has an Imbued Property of which you want to increase the level, directly drag it onto that property instead and skip step 2.
2. This will open the "Choose material type" window. Select the imbuement you want to add.
<img width="396" height="301" alt="image" src="https://github.com/user-attachments/assets/3dd084ae-bc27-4ac5-9934-edd6eeafe976" /> .

3. By default the module will try to consume the full value of the part. In the Assign Material window, you can set how much is consumed manually, or to consume only enough to hit a certain level on the imbuement.

By default, the subsystem allows for the refinement of monster parts into weapons, handwraps, armor, and skill items. If you ever try to create a refined item with the method below and it returns an error, that means the subsystem doesn't have rules for refining that type of item and so there is no official implementation in this module. You can add your own refinements and imbuements using homebrew, see the link at the top of this ReadMe.
