const initialPartyData = [
    {
        room: "balcony", floor: 2,
        guests: [
            { name: "Aigerim", color: "blue", time: "20:45", aitu: true, items: ["cup", "crumbs"] },
            { name: "Aliya", color: "yellow", time: "21:15", aitu: false, items: ["phone", "cup"] },
            { name: "Madina", color: "green", time: "22:10", aitu: false, items: ["phone", "bag", "crumbs"] },
            { name: "Ivan", color: "blue", time: "20:10", aitu: true, items: ["phone"] }
        ]
    },
    {
        room: "hall", floor: 2,
        guests: [
            { name: "Arman", color: "yellow", time: "20:35", aitu: false, items: ["glasses", "bag"] },
            { name: "Sophia", color: "purple", time: "21:20", aitu: true, items: ["phone"] },
            { name: "Dias", color: "blue", time: "19:45", aitu: true, items: [] },
            { name: "Bekzat", color: "purple", time: "20:55", aitu: false, items: ["bag", "cup", "crumbs"] },
            { name: "Aruzhan", color: "blue", time: "21:50", aitu: true, items: ["phone"] },
            { name: "Saule", color: "green", time: "21:25", aitu: false, items: ["glasses"] }
        ]
    },
    {
        room: "kitchen", floor: 1,
        guests: [
            { name: "Nurlan", color: "red", time: "19:40", aitu: true, items: ["phone", "cup"] },
            { name: "Emma", color: "red", time: "20:15", aitu: false, items: ["bag"] },
            { name: "Timur", color: "green", time: "21:05", aitu: true, items: ["phone", "bag", "crumbs"] },
            { name: "Sergey", color: "orange", time: "20:50", aitu: true, items: [] },
            { name: "Yerlan", color: "pink", time: "21:40", aitu: true, items: ["glasses", "phone"] },
            { name: "Kamila", color: "black", time: "20:05", aitu: false, items: ["cup"] }
        ]
    },
    {
        room: "livingroom", floor: 1,
        guests: [
            { name: "Daniel", color: "blue", time: "19:55", aitu: true, items: ["glasses"] },
            { name: "Zarina", color: "purple", time: "21:10", aitu: false, items: ["bag", "crumbs", "phone"] },
            { name: "Natasha", color: "yellow", time: "20:30", aitu: true, items: [] },
            { name: "Askar", color: "yellow", time: "21:00", aitu: true, items: ["phone"] },
            { name: "Inkar", color: "purple", time: "20:20", aitu: false, items: ["bag"] }
        ]
    }
];

let currentPartyData = JSON.parse(JSON.stringify(initialPartyData));

function createGuestCard(guest) {
    const avatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${guest.name}`;
    const itemIcons = { phone: "📱", glasses: "👓", bag: "👜", cup: "🥤", crumbs: "🍰" };
    const itemsStr = guest.items.map(i => itemIcons[i] || i).join(" ");

    const $card = $("<div>")
        .addClass(`guest-card item-color-${guest.color}`)
        .attr({
            "data-name": guest.name,
            "data-color": guest.color,
            "data-time": guest.time,
            "data-aitu": guest.aitu,
            "data-items": guest.items.join(",")
        });

    if (guest.aitu) $card.addClass("is-aitu");
    guest.items.forEach(item => $card.addClass(`has-${item}`));

    $card.html(`
        <div class="avatar-wrapper color-${guest.color}">
            <img src="${avatarUrl}" alt="${guest.name}">
            ${guest.aitu ? '<div class="aitu-badge">A</div>' : ''}
        </div>
        <div class="guest-name">${guest.name}</div>
        <div class="guest-time">${guest.time}</div>
        <div class="guest-items">${itemsStr || '&nbsp;'}</div>
    `);

    return $card;
}

function renderParty(data) {
    $(".guests-list").empty();
    data.forEach(roomData => {
        const $container = $(`#room-${roomData.room} .guests-list`);
        roomData.guests.forEach(guest => {
            $container.append(createGuestCard(guest));
        });
    });
}

const cases = {
    1: () => $("#room-hall .guest-card"),
    2: () => $('.guest-card[data-color="yellow"], .guest-card[data-color="purple"]'),
    3: () => $('.floor[data-floor="2"] .guest-card[data-aitu="true"]'),
    4: () => $(".guest-card.has-glasses, .guest-card.has-bag"),
    5: () => $('.guest-card[data-items=""]'),
    6: () => $(".guest-card.has-phone:not(.has-bag)"),
    7: () => $(".guest-card").filter(function() {
        const t = $(this).attr("data-time");
        return t >= "20:30" && t <= "21:00";
    }),
    8: () => $('.guest-card[data-aitu="false"]').filter(function() {
        return $(this).attr("data-time") > "21:00";
    }),
    9: () => $('.guest-card[data-name="Askar"]').siblings(".guest-card"),
    10: () => $(".guests-list .guest-card:last-child"),
    11: () => $(".guests-list .guest-card:nth-child(3)"),
    12: () => $('.guest-card[data-name="Timur"]').nextAll(".guest-card"),
    13: () => $('.guest-card[data-color="black"]').prev(".guest-card"),
    14: () => $('.guest-card[data-name="Aruzhan"]').closest(".room"),
    15: () => $(".room").filter(function() {
        return $(this).find(".guest-card").length < 6;
    }),
    16: () => $(".room").has(".guest-card.has-cup").not(":has(.guest-card.has-glasses)"),
    17: () => $(".guests-list").map(function() {
        return $(this).find(".guest-card").toArray().sort((a, b) =>
            $(a).attr("data-time").localeCompare($(b).attr("data-time"))
        )[0];
    }),
    18: () => {
        const miras = { name: "Miras", color: "blue", time: "21:20", aitu: true, items: ["phone"] };
        const $mirasCard = createGuestCard(miras).hide();
        $('.guest-card[data-name="Askar"]').after($mirasCard);
        $mirasCard.fadeIn(600);
        return $mirasCard;
    },
    19: () => {
        const $natasha = $('.guest-card[data-name="Natasha"]');
        $natasha.fadeOut(600, function() { $(this).remove(); });
        return $natasha;
    },
    20: () => {
        return $(".guest-card.has-crumbs:not(.has-cup)").filter(function() {
            const time = $(this).attr("data-time");
            const arrivedInTimeWindow = time > "21:00" && time < "21:30";
            const hasAituNeighbor = $(this).prev(".is-aitu").length > 0 || $(this).next(".is-aitu").length > 0;

            return arrivedInTimeWindow && hasAituNeighbor;
        });
    }
};

$(document).ready(function() {
    renderParty(currentPartyData);

    const $btnContainer = $("#case-buttons");
    for (let i = 1; i <=20 ; i++) {
        $btnContainer.append(`<button class="btn-case" data-case="${i}">Case ${i}</button>`);
    }

    $(document).on("click", ".btn-case", function() {
        const caseNum = $(this).data("case");

        if (caseNum === 18 || caseNum === 19) {
            renderParty(currentPartyData);
        }

        const $elements = cases[caseNum]();

        $(".guest-card, .room").removeClass("highlight").stop(true, true);

        $elements.addClass("highlight");

        if ($elements.hasClass("guest-card")) {
            $elements.animate({ marginTop: "-10px" }, 150).animate({ marginTop: "0px" }, 150);
        }

        let names = [];
        $elements.each(function() {
            if ($(this).hasClass("guest-card")) {
                names.push($(this).attr("data-name"));
            } else if ($(this).hasClass("room")) {
                names.push($(this).find("h2").text());
            }
        });

        $("#result-text").html(`<strong>Case ${caseNum}:</strong> Found (${names.length}): ${names.join(", ")}`);
    });
});