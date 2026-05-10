window.MathJax = {
    tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]],
        processEscapes: true
    },
    svg: {
        fontCache: "global"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    for (const button of document.querySelectorAll("[data-section-action]")) {
        button.addEventListener("click", () => {
            const shouldOpen = button.dataset.sectionAction === "expand";
            for (const section of document.querySelectorAll(".collapsible-section")) {
                section.open = shouldOpen;
            }
        });
    }

    document.querySelectorAll("[data-force-download]").forEach((link) => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();

            const url = link.getAttribute("href");
            const filename = link.getAttribute("download") || url.split("/").pop();

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Download failed: ${response.status}`);
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");

                downloadLink.href = blobUrl;
                downloadLink.download = filename;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                downloadLink.remove();
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                window.location.href = url;
            }
        });
    });

    if (window.PORTFOLIO_DATA) {
        initPortfolio(window.PORTFOLIO_DATA);
    }
});

function initPortfolio(data) {
    const profile = data.profile || {};
    const state = {
        experience: 0,
        education: 0,
        projectPage: 0
    };

    document.title = profile.name ? `${profile.name} | Portfolio` : "Portfolio";
    setText("[data-profile='name']", profile.name || "Portfolio");
    setText("[data-profile='role']", profile.role || "");
    setText("[data-profile='summary']", profile.summary || "");
    setText("#profile-kicker", profile.kicker || "PORTFOLIO");
    setText("#timeline-intro", data.timelineIntro || "");
    setText("#projects-intro", data.projectsIntro || "");

    renderProfile(profile);
    renderSwitcher("experience", data.experience || [], state);
    renderSwitcher("education", data.education || [], state);
    renderProjects(data.projects || [], state);
    bindSwitchers(data, state);
    bindProjectPagination(data, state);
    bindSectionObserver();
    initSnakeGame();
}

function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node) {
        node.textContent = text;
    }
}

function renderProfile(profile) {
    const facts = [
        ["Location", profile.location],
        ["Email", profile.email],
        ["Availability", profile.availability]
    ].filter((fact) => fact[1]);

    const factsNode = document.getElementById("profile-facts");
    replaceChildren(factsNode, facts.map(([label, value]) => {
        const item = element("div", "profile-fact");
        item.append(
            element("span", "fact-label", label),
            element("span", "fact-value", value)
        );
        return item;
    }));

    const linksNode = document.getElementById("profile-links");
    replaceChildren(linksNode, (profile.links || []).map((link) => {
        const anchor = element("a", "", link.label || "Link");
        anchor.href = link.url || "#";
        if (!anchor.href.startsWith("mailto:")) {
            anchor.target = "_blank";
            anchor.rel = "noreferrer";
        }
        return anchor;
    }));
}

function renderSwitcher(type, items, state) {
    const target = document.getElementById(`${type}-view`);
    const status = document.getElementById(`${type}-status`);
    const buttons = document.querySelectorAll(`[data-switch='${type}']`);

    if (!target) {
        return;
    }

    if (!items.length) {
        replaceChildren(target, [element("p", "empty-state", `No ${type} entries yet.`)]);
        if (status) {
            status.textContent = "0 / 0";
        }
        buttons.forEach((button) => {
            button.disabled = true;
        });
        return;
    }

    state[type] = wrapIndex(state[type], items.length);
    const item = items[state[type]];
    const heading = element("div", "item-heading");
    heading.append(
        element("p", "item-period", item.period || ""),
        element("h3", "", item.title || ""),
        element("p", "item-subtitle", joinParts([item.organization, item.location], " | "))
    );

    const body = [
        heading,
        element("p", "item-description", item.description || "")
    ];

    if (item.highlights && item.highlights.length) {
        const list = element("ul", "highlight-list");
        item.highlights.forEach((highlight) => {
            list.append(element("li", "", highlight));
        });
        body.push(list);
    }

    if (item.tags && item.tags.length) {
        const tags = element("div", "tag-list");
        item.tags.forEach((tag) => tags.append(element("span", "", tag)));
        body.push(tags);
    }

    replaceChildren(target, body);
    if (status) {
        status.textContent = `${state[type] + 1} / ${items.length}`;
    }
    buttons.forEach((button) => {
        button.disabled = items.length <= 1;
    });
}

function renderProjects(projects, state) {
    const list = document.getElementById("project-list");
    const toolbar = document.getElementById("project-toolbar");
    const status = document.getElementById("project-status");
    const buttons = document.querySelectorAll("[data-project-action]");
    const pageSize = 3;

    if (!list) {
        return;
    }

    if (!projects.length) {
        replaceChildren(list, [element("p", "empty-state", "No projects yet.")]);
        if (toolbar) {
            toolbar.hidden = true;
        }
        return;
    }

    const pageCount = Math.ceil(projects.length / pageSize);
    state.projectPage = wrapIndex(state.projectPage, pageCount);
    const startIndex = state.projectPage * pageSize;
    const visibleProjects = projects.slice(startIndex, startIndex + pageSize);

    if (toolbar) {
        toolbar.hidden = pageCount <= 1;
    }
    if (status) {
        status.textContent = `${state.projectPage + 1} / ${pageCount}`;
    }
    buttons.forEach((button) => {
        button.disabled = pageCount <= 1;
    });

    replaceChildren(list, visibleProjects.map((project, index) => {
        const projectIndex = startIndex + index;
        const card = element("article", "project-card");
        const topLine = element("div", "project-topline");
        topLine.append(
            element("span", "project-index", String(projectIndex + 1).padStart(2, "0")),
            element("span", "project-kind", joinParts([project.kind, project.status], " | "))
        );

        card.append(
            topLine,
            element("h3", "", project.name || ""),
            element("p", "project-description", project.description || "")
        );

        if (project.highlights && project.highlights.length) {
            const listNode = element("ul", "highlight-list");
            project.highlights.forEach((highlight) => {
                listNode.append(element("li", "", highlight));
            });
            card.append(listNode);
        }

        if (project.technologies && project.technologies.length) {
            const technologies = element("div", "tag-list");
            project.technologies.forEach((technology) => {
                technologies.append(element("span", "", technology));
            });
            card.append(technologies);
        }

        if (project.links && project.links.length) {
            const links = element("div", "project-links");
            project.links.forEach((link) => {
                const anchor = element("a", "", link.label || "Open");
                anchor.href = link.url || "#";
                anchor.target = "_blank";
                anchor.rel = "noreferrer";
                links.append(anchor);
            });
            card.append(links);
        }

        return card;
    }));
}

function bindProjectPagination(data, state) {
    document.querySelectorAll("[data-project-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const direction = Number(button.dataset.projectAction || 1);
            const projects = data.projects || [];
            const pageCount = Math.ceil(projects.length / 3);
            state.projectPage = wrapIndex(state.projectPage + direction, pageCount);
            renderProjects(projects, state);
        });
    });
}

function bindSwitchers(data, state) {
    document.querySelectorAll("[data-switch]").forEach((button) => {
        button.addEventListener("click", () => {
            const type = button.dataset.switch;
            const direction = Number(button.dataset.direction || 1);
            const items = data[type] || [];
            state[type] = wrapIndex(state[type] + direction, items.length);
            renderSwitcher(type, items, state);
        });
    });
}

function bindSectionObserver() {
    const panels = document.querySelectorAll(".portfolio-panel");
    const dots = document.querySelectorAll("[data-section-dot]");

    if (!panels.length || !dots.length || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            dots.forEach((dot) => {
                dot.classList.toggle("is-active", dot.dataset.sectionDot === entry.target.id);
            });
        });
    }, {
        root: document.querySelector(".snap-container"),
        threshold: 0.62
    });

    panels.forEach((panel) => observer.observe(panel));
}

function initSnakeGame() {
    const canvas = document.getElementById("snake-game");
    if (!canvas || !canvas.getContext) {
        return;
    }

    const context = canvas.getContext("2d");
    const scoreNode = document.getElementById("snake-score");
    const actionNode = document.getElementById("snake-action");
    const directionNode = document.getElementById("snake-direction");
    const controlButtons = document.querySelectorAll("[data-snake-control]");
    const columns = 16;
    const rows = 12;
    const cellSize = canvas.width / columns;
    const directions = [
        { name: "up", label: "UP", x: 0, y: -1 },
        { name: "right", label: "RIGHT", x: 1, y: 0 },
        { name: "down", label: "DOWN", x: 0, y: 1 },
        { name: "left", label: "LEFT", x: -1, y: 0 }
    ];
    const directionByName = Object.fromEntries(directions.map((direction) => [direction.name, direction]));
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tickDelay = prefersReducedMotion ? 420 : 170;
    let snake;
    let food;
    let currentDirection;
    let score;

    resetSnake();
    drawSnakeGame();
    window.setInterval(stepSnake, tickDelay);

    function resetSnake() {
        snake = [
            { x: 6, y: 6 },
            { x: 5, y: 6 },
            { x: 4, y: 6 },
            { x: 3, y: 6 }
        ];
        currentDirection = directionByName.right;
        score = 0;
        food = placeFood(snake);
        updateSnakeConsole(currentDirection, "auto pilot reset");
    }

    function stepSnake() {
        currentDirection = chooseSnakeDirection();
        const nextHead = {
            x: snake[0].x + currentDirection.x,
            y: snake[0].y + currentDirection.y
        };
        const ateFood = sameCell(nextHead, food);
        const blockingBody = snake.slice(0, ateFood ? snake.length : -1);

        if (!isInsideGrid(nextHead) || hasCell(blockingBody, nextHead)) {
            resetSnake();
            drawSnakeGame();
            return;
        }

        snake.unshift(nextHead);

        if (ateFood) {
            score += 1;
            food = placeFood(snake);
            updateSnakeConsole(currentDirection, "bite pixel");
        } else {
            snake.pop();
            updateSnakeConsole(currentDirection, `tap ${currentDirection.label}`);
        }

        drawSnakeGame();
    }

    function chooseSnakeDirection() {
        const pathDirection = findSnakePath();
        if (pathDirection) {
            return pathDirection;
        }

        const safeDirections = directions.filter((direction) => {
            const next = {
                x: snake[0].x + direction.x,
                y: snake[0].y + direction.y
            };
            return isInsideGrid(next) && !hasCell(snake.slice(0, -1), next);
        });

        if (!safeDirections.length) {
            return currentDirection;
        }

        safeDirections.sort((first, second) => {
            const firstDistance = manhattanDistance(moveCell(snake[0], first), food);
            const secondDistance = manhattanDistance(moveCell(snake[0], second), food);
            if (firstDistance === secondDistance && first.name === currentDirection.name) {
                return -1;
            }
            return firstDistance - secondDistance;
        });

        return safeDirections[0];
    }

    function findSnakePath() {
        const start = snake[0];
        const startKey = cellKey(start);
        const blocked = new Set(snake.slice(0, -1).map(cellKey));
        const queue = [start];
        const visited = new Set([startKey]);
        const parents = new Map();

        for (let index = 0; index < queue.length; index += 1) {
            const current = queue[index];
            const orderedDirections = directions
                .slice()
                .sort((first, second) => {
                    return manhattanDistance(moveCell(current, first), food) - manhattanDistance(moveCell(current, second), food);
                });

            for (const direction of orderedDirections) {
                const next = moveCell(current, direction);
                const nextKey = cellKey(next);

                if (!isInsideGrid(next) || blocked.has(nextKey) || visited.has(nextKey)) {
                    continue;
                }

                visited.add(nextKey);
                parents.set(nextKey, {
                    previousKey: cellKey(current),
                    direction
                });

                if (sameCell(next, food)) {
                    return firstPathDirection(nextKey, startKey, parents);
                }

                queue.push(next);
            }
        }

        return null;
    }

    function firstPathDirection(targetKey, startKey, parents) {
        let currentKey = targetKey;
        let parent = parents.get(currentKey);

        while (parent && parent.previousKey !== startKey) {
            currentKey = parent.previousKey;
            parent = parents.get(currentKey);
        }

        return parent ? parent.direction : null;
    }

    function placeFood(occupiedCells) {
        const availableCells = [];
        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < columns; x += 1) {
                const cell = { x, y };
                if (!hasCell(occupiedCells, cell)) {
                    availableCells.push(cell);
                }
            }
        }

        return availableCells[Math.floor(Math.random() * availableCells.length)] || { x: 1, y: 1 };
    }

    function drawSnakeGame() {
        context.fillStyle = "#282828";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = "rgba(235, 219, 178, 0.13)";
        context.lineWidth = 1;
        for (let x = 0; x <= columns; x += 1) {
            context.beginPath();
            context.moveTo(x * cellSize + 0.5, 0);
            context.lineTo(x * cellSize + 0.5, canvas.height);
            context.stroke();
        }
        for (let y = 0; y <= rows; y += 1) {
            context.beginPath();
            context.moveTo(0, y * cellSize + 0.5);
            context.lineTo(canvas.width, y * cellSize + 0.5);
            context.stroke();
        }

        drawCell(food, "#fb4934", 4);
        snake.forEach((cell, index) => {
            drawCell(cell, index === 0 ? "#fabd2f" : "#8ec07c", index === 0 ? 3 : 4);
        });
    }

    function drawCell(cell, color, inset) {
        context.fillStyle = color;
        context.fillRect(
            cell.x * cellSize + inset,
            cell.y * cellSize + inset,
            cellSize - inset * 2,
            cellSize - inset * 2
        );
    }

    function updateSnakeConsole(direction, action) {
        if (scoreNode) {
            scoreNode.textContent = `score ${score}`;
        }
        if (actionNode) {
            actionNode.textContent = action;
        }
        if (directionNode) {
            directionNode.textContent = direction.label;
        }

        controlButtons.forEach((button) => {
            const isActive = button.dataset.snakeControl === direction.name;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    function moveCell(cell, direction) {
        return {
            x: cell.x + direction.x,
            y: cell.y + direction.y
        };
    }

    function isInsideGrid(cell) {
        return cell.x >= 0 && cell.x < columns && cell.y >= 0 && cell.y < rows;
    }

    function hasCell(cells, target) {
        return cells.some((cell) => sameCell(cell, target));
    }

    function sameCell(first, second) {
        return first.x === second.x && first.y === second.y;
    }

    function cellKey(cell) {
        return `${cell.x},${cell.y}`;
    }

    function manhattanDistance(first, second) {
        return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
    }
}

function element(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) {
        node.className = className;
    }
    if (text !== undefined && text !== null) {
        node.textContent = text;
    }
    return node;
}

function replaceChildren(node, children) {
    if (node) {
        node.replaceChildren(...children);
    }
}

function joinParts(parts, separator) {
    return parts.filter(Boolean).join(separator);
}

function wrapIndex(index, length) {
    if (!length) {
        return 0;
    }
    return ((index % length) + length) % length;
}
