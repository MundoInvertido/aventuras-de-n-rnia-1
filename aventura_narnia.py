"""
Aventura Nárnia — Jogo de Tabuleiro em Python (Pygame)
Versão completa com seleção de personagens, mundos, perguntas, dado, confetes e vitória.
"""
import pygame
import sys
import random
import math

pygame.init()

# ─── CONFIGURAÇÃO ────────────────────────────────────────────────────
WIDTH, HEIGHT = 1280, 720
FPS = 60
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
pygame.display.set_caption("Aventura Nárnia 🦁")
clock = pygame.time.Clock()

# ─── FONTES ──────────────────────────────────────────────────────────
try:
    FONT_PATH = None  # usa fonte padrão
    font_sm = pygame.font.SysFont("segoeui", 16, bold=True)
    font_md = pygame.font.SysFont("segoeui", 22, bold=True)
    font_lg = pygame.font.SysFont("segoeui", 32, bold=True)
    font_xl = pygame.font.SysFont("segoeui", 48, bold=True)
    font_title = pygame.font.SysFont("segoeui", 56, bold=True)
    font_emoji = pygame.font.SysFont("segoeui", 52)
    font_icon = pygame.font.SysFont("segoeui", 40)
except Exception:
    font_sm = pygame.font.Font(None, 20)
    font_md = pygame.font.Font(None, 28)
    font_lg = pygame.font.Font(None, 38)
    font_xl = pygame.font.Font(None, 56)
    font_title = pygame.font.Font(None, 64)
    font_emoji = pygame.font.Font(None, 56)
    font_icon = pygame.font.Font(None, 44)

# ─── CORES ───────────────────────────────────────────────────────────
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GOLD = (251, 191, 36)
DARK_GOLD = (180, 130, 20)
GREEN = (34, 197, 94)
DARK_GREEN = (21, 128, 61)
RED = (239, 68, 68)
DARK_RED = (185, 28, 28)
BLUE = (59, 130, 246)
DARK_BLUE = (29, 78, 216)
AMBER = (245, 158, 11)
SLATE = (71, 85, 105)
DARK_SLATE = (30, 41, 59)
LIGHT_SLATE = (226, 232, 240)
SKY = (56, 189, 248)

# ─── PERSONAGENS ─────────────────────────────────────────────────────
CHARACTERS = [
    {"id": "ripchip",    "name": "Ripchip",            "icon": "🐭", "color": (220, 38, 38)},
    {"id": "topeira",    "name": "Topeira (Brilha)",   "icon": "🦔", "color": (139, 69, 19)},
    {"id": "anao",       "name": "Anão (Trumpkin)",    "icon": "⛏️", "color": (251, 146, 60)},
    {"id": "cavalo",     "name": "Cavalo (Bri)",       "icon": "🐴", "color": (161, 98, 7)},
    {"id": "coruja",     "name": "Coruja (Plumante)",  "icon": "🦉", "color": (71, 85, 105)},
    {"id": "castor",     "name": "Sr. Castor",         "icon": "🦫", "color": (146, 64, 14)},
    {"id": "fauno",      "name": "Fauno (Tumnus)",     "icon": "🐐", "color": (22, 163, 74)},
    {"id": "centauro",   "name": "Centauro",           "icon": "🐎", "color": (161, 98, 7)},
    {"id": "leao",       "name": "Leão (Aslan)",       "icon": "🦁", "color": (251, 191, 36)},
    {"id": "feiticeira", "name": "Feiticeira Branca",  "icon": "🧙", "color": (56, 189, 248)},
]

# ─── MUNDOS ──────────────────────────────────────────────────────────
WORLDS = [
    {"id": "floresta", "name": "Floresta de Lanterna",       "icon": "🌲", "desc": "A floresta mágica",           "sky": (135, 206, 250), "ground": (74, 222, 128), "tile_color": (133, 77, 14)},
    {"id": "neve",     "name": "Inverno Eterno",             "icon": "❄️",  "desc": "Neve da Feiticeira Branca",   "sky": (199, 210, 254), "ground": (226, 232, 240), "tile_color": (100, 116, 139)},
    {"id": "deserto",  "name": "Deserto de Calormen",        "icon": "🏜️",  "desc": "As areias quentes do sul",    "sky": (251, 191, 36),  "ground": (212, 160, 103), "tile_color": (120, 53, 15)},
    {"id": "mar",      "name": "Mar das Ilhas Solitárias",   "icon": "⛵",  "desc": "Navega pelo mar oriental",    "sky": (14, 165, 233),  "ground": (34, 211, 238),  "tile_color": (30, 64, 175)},
    {"id": "castelo",  "name": "Castelo de Cair Paravel",    "icon": "🏰",  "desc": "O glorioso castelo",         "sky": (124, 58, 237),  "ground": (107, 142, 35),  "tile_color": (88, 28, 135)},
]

# ─── PERGUNTAS ───────────────────────────────────────────────────────
QUESTIONS = [
    ("Há 12 ovos na cartela.", "contagem"),
    ("A bicicleta tem 2 rodas.", "contagem"),
    ("A minha gata teve 4 filhotes.", "contagem"),
    ("A palavra 'escola' tem 6 letras.", "contagem"),
    ("Comprei 5 pães na padaria.", "contagem"),
    ("Existem 30 alunos na nossa sala.", "contagem"),
    ("A aranha possui 8 patas.", "contagem"),
    ("Ganhei 3 cadernos novos.", "contagem"),
    ("Faltam 10 dias para as férias.", "contagem"),
    ("O relógio tem 3 ponteiros.", "contagem"),
    ("Fui o 1º aluno a terminar o teste.", "ordenacao"),
    ("O consultório fica no 3º andar do prédio.", "ordenacao"),
    ("Ele é o 2º filho da família.", "ordenacao"),
    ("A minha equipa ficou em 4º lugar no torneio.", "ordenacao"),
    ("Sentei-me na 3ª fila do cinema.", "ordenacao"),
    ("Hoje é o 5º dia da semana.", "ordenacao"),
    ("Moro na 10ª casa da rua.", "ordenacao"),
    ("Este é o meu 2º par de sapatilhas.", "ordenacao"),
    ("Fiquei em 8º na corrida de sacos.", "ordenacao"),
    ("Esta é a 1ª vez que venho aqui.", "ordenacao"),
    ("A garrafa contém 2 litros de água.", "medida"),
    ("O pacote de feijão pesa 1 kg.", "medida"),
    ("A viagem até à praia durou 4 horas.", "medida"),
    ("A temperatura máxima hoje será de 30 graus.", "medida"),
    ("O muro da escola tem 3 metros de altura.", "medida"),
    ("Comprei 500 gramas de queijo.", "medida"),
    ("O meu lápis tem 15 centímetros.", "medida"),
    ("O campo tem 20 metros de comprimento.", "medida"),
    ("Fiz um bolo e usei 2 chávenas de farinha.", "medida"),
    ("Fiquei 30 minutos na fila da cantina.", "medida"),
    ("O código postal da minha rua é 1234-000.", "codigo"),
    ("O meu número de telefone é 91234-5678.", "codigo"),
    ("A matrícula do carro do meu pai é XY-98-76.", "codigo"),
    ("O código de barras do produto é 7891011.", "codigo"),
    ("O autocarro que vai para o centro é a carreira 478.", "codigo"),
    ("A password do Wi-Fi é 2024abc.", "codigo"),
    ("Moro na porta número 150.", "codigo"),
    ("O meu Cartão de Cidadão é 12345678.", "codigo"),
    ("O canal de desenhos animados é o 45.", "codigo"),
    ("O número de estudante é 2026001.", "codigo"),
]

ANSWER_LABELS = {
    "contagem": "Contagem",
    "ordenacao": "Ordenação",
    "medida": "Medida",
    "codigo": "Código",
}

ANSWER_OPTIONS = ["contagem", "ordenacao", "medida", "codigo"]

# ─── CASAS ESPECIAIS ─────────────────────────────────────────────────
TRACK_LENGTH = 30
SPECIAL_TILES = {
    5:  {"type": "advance", "value": 2,  "text": "Encontraste um atalho! Avança 2 casas."},
    9:  {"type": "back",    "value": -3, "text": "Escorregaste na lama! Recua 3 casas."},
    14: {"type": "advance", "value": 3,  "text": "Botas mágicas! Avança 3 casas."},
    19: {"type": "back",    "value": -4, "text": "Perdeste-te na floresta! Recua 4 casas."},
    24: {"type": "reset",   "value": 0,  "text": "Caíste num buraco! Volta ao INÍCIO."},
    27: {"type": "advance", "value": 2,  "text": "Vento favorável! Avança 2 casas."},
}

# ─── UTILIDADES ──────────────────────────────────────────────────────
def draw_text(surf, text, font, color, x, y, anchor="center", max_width=None):
    """Renderiza texto com alinhamento. Suporta max_width para word-wrap simples."""
    if max_width and font.size(text)[0] > max_width:
        words = text.split()
        lines = []
        current = ""
        for w in words:
            test = current + (" " if current else "") + w
            if font.size(test)[0] <= max_width:
                current = test
            else:
                if current:
                    lines.append(current)
                current = w
        if current:
            lines.append(current)
        total_h = len(lines) * (font.get_height() + 2)
        start_y = y - total_h // 2 if anchor == "center" else y
        for i, line in enumerate(lines):
            s = font.render(line, True, color)
            r = s.get_rect()
            if anchor == "center":
                r.centerx = x
            elif anchor == "topleft":
                r.left = x
            r.top = start_y + i * (font.get_height() + 2)
            surf.blit(s, r)
        return total_h
    else:
        s = font.render(text, True, color)
        r = s.get_rect()
        if anchor == "center":
            r.center = (x, y)
        elif anchor == "topleft":
            r.topleft = (x, y)
        elif anchor == "midleft":
            r.midleft = (x, y)
        surf.blit(s, r)
        return font.get_height()


def draw_rounded_rect(surf, rect, color, radius=12, border=0, border_color=None):
    """Desenha retângulo arredondado."""
    pygame.draw.rect(surf, color, rect, border_radius=radius)
    if border and border_color:
        pygame.draw.rect(surf, border_color, rect, width=border, border_radius=radius)


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def generate_tile_positions():
    """Gera posições das casas ao longo de uma curva."""
    positions = []
    cx, cy = WIDTH // 2, HEIGHT // 2 - 20
    radius_x, radius_y = 380, 200
    for i in range(TRACK_LENGTH + 1):
        t = i / TRACK_LENGTH
        angle = math.pi * 2 * t * 1.3 - math.pi * 0.65
        # Curva sinuosa
        x = cx + math.cos(angle) * radius_x * (0.4 + 0.6 * t)
        y = cy + math.sin(angle) * radius_y * (0.5 + 0.5 * t)
        # Limitar à tela
        x = max(60, min(WIDTH - 60, x))
        y = max(80, min(HEIGHT - 100, y))
        positions[len(positions):] = [(int(x), int(y))]
    return positions


# ─── CONFETTI ────────────────────────────────────────────────────────
class ConfettiParticle:
    def __init__(self):
        self.reset()

    def reset(self):
        self.x = random.randint(0, WIDTH)
        self.y = random.randint(-HEIGHT, 0)
        self.size = random.randint(5, 12)
        self.color = random.choice([GOLD, RED, BLUE, GREEN, (168, 85, 247), (236, 72, 153), (249, 115, 22), (6, 182, 212)])
        self.speed = random.uniform(2, 6)
        self.angle = random.uniform(0, math.pi * 2)
        self.spin = random.uniform(-0.1, 0.1)
        self.is_circle = random.random() > 0.5

    def update(self):
        self.y += self.speed
        self.x += math.sin(self.angle) * 1.5
        self.angle += self.spin
        if self.y > HEIGHT + 20:
            self.reset()

    def draw(self, surf):
        if self.is_circle:
            pygame.draw.circle(surf, self.color, (int(self.x), int(self.y)), self.size // 2)
        else:
            r = pygame.Rect(int(self.x), int(self.y), self.size, self.size)
            pygame.draw.rect(surf, self.color, r)


# ─── CLASSE PRINCIPAL DO JOGO ────────────────────────────────────────
class NarniaGame:
    def __init__(self):
        self.state = "select_p1"  # select_p1, select_p2, select_world, playing, dice, event, end
        self.p1_char = None
        self.p2_char = None
        self.world = None
        self.current_player = 1
        self.p1_pos = 0
        self.p2_pos = 0
        self.p1_score = 0
        self.p2_score = 0
        self.p1_correct = 0
        self.p1_wrong = 0
        self.p2_correct = 0
        self.p2_wrong = 0
        self.question = None
        self.feedback = None
        self.feedback_timer = 0
        self.dice_value = 1
        self.dice_rolling = False
        self.dice_roll_count = 0
        self.dice_timer = 0
        self.special_event = None
        self.event_timer = 0
        self.winner = None
        self.time_left = 20
        self.timer_tick = 0
        self.tile_positions = generate_tile_positions()
        self.confetti = [ConfettiParticle() for _ in range(80)]
        self.hover_index = -1
        self.animation_time = 0
        self.p1_visual_pos = 0.0
        self.p2_visual_pos = 0.0
        self.pick_question()

    def pick_question(self):
        self.question = random.choice(QUESTIONS)
        self.time_left = 20
        self.timer_tick = pygame.time.get_ticks()
        self.feedback = None

    def get_current_pos(self, player=None):
        if player is None:
            player = self.current_player
        return self.p1_pos if player == 1 else self.p2_pos

    def set_pos(self, player, pos):
        pos = max(0, min(pos, TRACK_LENGTH))
        if player == 1:
            self.p1_pos = pos
        else:
            self.p2_pos = pos

    def start_game(self):
        self.p1_pos = 0
        self.p2_pos = 0
        self.p1_visual_pos = 0.0
        self.p2_visual_pos = 0.0
        self.p1_score = 0
        self.p2_score = 0
        self.p1_correct = 0
        self.p1_wrong = 0
        self.p2_correct = 0
        self.p2_wrong = 0
        self.current_player = 1
        self.winner = None
        self.feedback = None
        self.special_event = None
        self.state = "playing"
        self.pick_question()

    def handle_answer(self, answer):
        if self.feedback:
            return
        correct = answer == self.question[1]
        if correct:
            if self.current_player == 1:
                self.p1_score += 10
                self.p1_correct += 1
            else:
                self.p2_score += 10
                self.p2_correct += 1
            self.feedback = ("correct", "Fantástico! Clica para girar o dado!")
            self.feedback_timer = pygame.time.get_ticks()
        else:
            if self.current_player == 1:
                self.p1_wrong += 1
            else:
                self.p2_wrong += 1
            self.feedback = ("wrong", f"Ops! A resposta era {ANSWER_LABELS[self.question[1]]}.")
            self.feedback_timer = pygame.time.get_ticks()

    def handle_timeout(self):
        if self.feedback:
            return
        if self.current_player == 1:
            self.p1_wrong += 1
        else:
            self.p2_wrong += 1
        # Penalidade: recua 3 casas
        pos = self.get_current_pos()
        new_pos = max(pos - 3, 0)
        self.set_pos(self.current_player, new_pos)
        self.feedback = ("wrong", "⏰ Tempo esgotado! Recuaste 3 casas.")
        self.feedback_timer = pygame.time.get_ticks()

    def next_turn(self):
        self.current_player = 2 if self.current_player == 1 else 1
        self.state = "playing"
        self.feedback = None
        self.special_event = None
        self.pick_question()

    def start_dice(self):
        self.state = "dice"
        self.dice_rolling = True
        self.dice_roll_count = 0
        self.dice_timer = pygame.time.get_ticks()
        self.feedback = None

    def finish_dice(self, value):
        self.dice_rolling = False
        pos = self.get_current_pos()
        new_pos = min(pos + value, TRACK_LENGTH)
        self.set_pos(self.current_player, new_pos)
        if new_pos >= TRACK_LENGTH:
            self.finish_game(self.current_player)
        elif new_pos in SPECIAL_TILES:
            self.trigger_event(new_pos)
        else:
            self.feedback = ("correct", f"Avançaste {value} casas!")
            self.feedback_timer = pygame.time.get_ticks()

    def trigger_event(self, pos):
        event = SPECIAL_TILES[pos]
        self.special_event = event
        self.state = "event"
        self.event_timer = pygame.time.get_ticks()

    def apply_event(self):
        event = self.special_event
        pos = self.get_current_pos()
        if event["type"] == "reset":
            new_pos = 0
        else:
            new_pos = max(0, min(pos + event["value"], TRACK_LENGTH))
        self.set_pos(self.current_player, new_pos)
        if new_pos >= TRACK_LENGTH:
            self.finish_game(self.current_player)
        else:
            self.next_turn()

    def finish_game(self, winner_player):
        self.winner = winner_player
        self.state = "end"
        for c in self.confetti:
            c.reset()

    def end_game_manually(self):
        if self.p1_pos > self.p2_pos:
            w = 1
        elif self.p2_pos > self.p1_pos:
            w = 2
        elif self.p1_score > self.p2_score:
            w = 1
        elif self.p2_score > self.p1_score:
            w = 2
        else:
            w = self.current_player
        self.finish_game(w)

    # ─── UPDATE ──────────────────────────────────────────────────────
    def update(self):
        global WIDTH, HEIGHT, screen
        self.animation_time += 1

        # Smooth visual position interpolation
        speed = 0.08
        self.p1_visual_pos += (self.p1_pos - self.p1_visual_pos) * speed
        self.p2_visual_pos += (self.p2_pos - self.p2_visual_pos) * speed

        now = pygame.time.get_ticks()

        if self.state == "playing" and not self.feedback:
            elapsed = (now - self.timer_tick) / 1000
            self.time_left = max(0, 20 - int(elapsed))
            if self.time_left <= 0:
                self.handle_timeout()

        # Auto-advance after feedback
        if self.feedback and self.state == "playing":
            is_correct = self.feedback[0] == "correct"
            delay = 1800 if is_correct else 2500
            if now - self.feedback_timer > delay:
                if is_correct:
                    self.start_dice()
                else:
                    self.next_turn()

        # Dice rolling animation
        if self.state == "dice" and self.dice_rolling:
            if now - self.dice_timer > 80:
                self.dice_value = random.randint(1, 6)
                self.dice_roll_count += 1
                self.dice_timer = now
                if self.dice_roll_count >= 15:
                    final = random.randint(1, 6)
                    self.dice_value = final
                    self.dice_rolling = False
                    self.feedback_timer = now

        # After dice stops, advance
        if self.state == "dice" and not self.dice_rolling and self.feedback is None:
            if now - self.feedback_timer > 800:
                self.finish_dice(self.dice_value)

        # After dice result feedback
        if self.state == "dice" and self.feedback and not self.dice_rolling:
            if now - self.feedback_timer > 2000:
                self.next_turn()

        # Event auto-continue
        if self.state == "event" and self.special_event:
            if now - self.event_timer > 3000:
                self.apply_event()

        # Confetti
        if self.state == "end":
            for c in self.confetti:
                c.update()

    # ─── DRAW ────────────────────────────────────────────────────────
    def draw(self):
        w, h = screen.get_size()

        if self.state in ("select_p1", "select_p2"):
            self.draw_select_screen(w, h)
        elif self.state == "select_world":
            self.draw_world_select(w, h)
        elif self.state == "end":
            self.draw_end_screen(w, h)
        else:
            self.draw_game(w, h)

    # ─── TELA DE SELEÇÃO ─────────────────────────────────────────────
    def draw_select_screen(self, w, h):
        is_p1 = self.state == "select_p1"
        # Background gradient
        for i in range(h):
            t = i / h
            c = lerp_color((186, 230, 253), (224, 242, 254), t)
            pygame.draw.line(screen, c, (0, i), (w, i))

        # Panel
        pw, ph = min(w - 40, 900), min(h - 40, 520)
        px, py = (w - pw) // 2, (h - ph) // 2
        panel = pygame.Rect(px, py, pw, ph)
        draw_rounded_rect(screen, panel, WHITE, 20, 6, DARK_GREEN)

        # Title
        draw_text(screen, "Aventura Nárnia", font_title, DARK_SLATE, w // 2, py + 45)
        color = BLUE if is_p1 else RED
        draw_text(screen, f"Jogador {'1' if is_p1 else '2'}, escolhe o teu Personagem!", font_md, color, w // 2, py + 90)

        # Character grid - 5 columns x 2 rows
        cols = 5
        card_w = (pw - 80) // cols
        card_h = 130
        start_x = px + 40
        start_y = py + 120

        self.hover_index = -1
        mx, my = pygame.mouse.get_pos()

        for i, char in enumerate(CHARACTERS):
            col = i % cols
            row = i // cols
            cx = start_x + col * card_w + card_w // 2
            cy = start_y + row * (card_h + 12) + card_h // 2

            card_rect = pygame.Rect(cx - card_w // 2 + 4, cy - card_h // 2, card_w - 8, card_h)

            is_disabled = (not is_p1 and self.p1_char is not None and self.p1_char["id"] == char["id"])
            is_hovered = card_rect.collidepoint(mx, my) and not is_disabled

            if is_hovered:
                self.hover_index = i

            if is_disabled:
                bg = (230, 230, 230)
                border_c = (180, 180, 180)
            elif is_hovered:
                bg = (255, 251, 235)
                border_c = AMBER
            else:
                bg = WHITE
                border_c = (200, 200, 200)

            draw_rounded_rect(screen, card_rect, bg, 14, 3, border_c)
            if is_hovered and not is_disabled:
                shadow = card_rect.inflate(4, 4)
                shadow.y += 3
                draw_rounded_rect(screen, shadow, (0, 0, 0, 30), 14)

            # Icon
            try:
                icon_surf = font_emoji.render(char["icon"], True, BLACK)
            except Exception:
                icon_surf = font_lg.render("?", True, BLACK)
            ir = icon_surf.get_rect(center=(cx, cy - 20))
            screen.blit(icon_surf, ir)

            # Name
            name_font = font_sm
            draw_text(screen, char["name"], name_font, DARK_SLATE if not is_disabled else (160, 160, 160), cx, cy + 40)

            # Color dot
            pygame.draw.circle(screen, char["color"], (cx, cy + 58), 5)

    # ─── TELA DE SELEÇÃO DE MUNDO ────────────────────────────────────
    def draw_world_select(self, w, h):
        # Dark gradient background
        for i in range(h):
            t = i / h
            c = lerp_color((49, 46, 129), (30, 27, 75), t)
            pygame.draw.line(screen, c, (0, i), (w, i))

        draw_text(screen, "Escolhe o Mundo", font_title, WHITE, w // 2, 60)
        draw_text(screen, "Onde será a aventura?", font_md, (180, 180, 255), w // 2, 110)

        card_w = min((w - 100) // len(WORLDS), 220)
        total_w = card_w * len(WORLDS) + 16 * (len(WORLDS) - 1)
        start_x = (w - total_w) // 2
        card_h = 220

        mx, my = pygame.mouse.get_pos()
        self.hover_index = -1

        for i, world in enumerate(WORLDS):
            cx = start_x + i * (card_w + 16) + card_w // 2
            cy = h // 2

            card_rect = pygame.Rect(cx - card_w // 2, cy - card_h // 2, card_w, card_h)
            is_hovered = card_rect.collidepoint(mx, my)

            if is_hovered:
                self.hover_index = i

            bg = (255, 255, 255, 30) if not is_hovered else (255, 255, 255, 50)
            bg_solid = lerp_color((40, 40, 100), (60, 60, 140), 0.3 if not is_hovered else 0.6)
            draw_rounded_rect(screen, card_rect, bg_solid, 16, 2, (255, 255, 255) if is_hovered else (100, 100, 180))

            try:
                icon_surf = font_emoji.render(world["icon"], True, WHITE)
            except Exception:
                icon_surf = font_lg.render("?", True, WHITE)
            ir = icon_surf.get_rect(center=(cx, cy - 50))
            screen.blit(icon_surf, ir)

            draw_text(screen, world["name"], font_sm, WHITE, cx, cy + 10, max_width=card_w - 16)
            draw_text(screen, world["desc"], font_sm, (180, 180, 220), cx, cy + 50, max_width=card_w - 16)

        # Voltar button
        back_rect = pygame.Rect(w // 2 - 60, h - 60, 120, 36)
        draw_rounded_rect(screen, back_rect, (60, 60, 100), 12, 1, (100, 100, 160))
        draw_text(screen, "← Voltar", font_sm, (180, 180, 220), w // 2, h - 42)

    # ─── TELA DO JOGO ────────────────────────────────────────────────
    def draw_game(self, w, h):
        world = self.world or WORLDS[0]

        # Background
        for i in range(h):
            t = i / h
            c = lerp_color(world["sky"], lerp_color(world["sky"], world["ground"], 0.3), t)
            pygame.draw.line(screen, c, (0, i), (w, i))

        # Ground
        ground_y = h * 2 // 3
        pygame.draw.rect(screen, world["ground"], (0, ground_y, w, h - ground_y))

        # Draw path lines between tiles
        positions = self.tile_positions
        for i in range(len(positions) - 1):
            x1, y1 = positions[i]
            x2, y2 = positions[i + 1]
            pygame.draw.line(screen, (200, 180, 130), (x1, y1), (x2, y2), 3)

        # Draw tiles
        for i, (tx, ty) in enumerate(positions):
            is_special = i in SPECIAL_TILES
            if i == 0:
                color = GREEN
            elif i == TRACK_LENGTH:
                color = GOLD
            elif is_special:
                st = SPECIAL_TILES[i]["type"]
                if st == "advance":
                    color = GREEN
                elif st == "back":
                    color = (251, 146, 60)
                elif st == "reset":
                    color = RED
                else:
                    color = AMBER
            else:
                color = world["tile_color"]

            # Tile shadow
            pygame.draw.circle(screen, (0, 0, 0, 40), (tx + 2, ty + 2), 22)
            pygame.draw.circle(screen, color, (tx, ty), 22)
            pygame.draw.circle(screen, lerp_color(color, WHITE, 0.3), (tx, ty), 18)

            # Tile label
            label = "I" if i == 0 else ("F" if i == TRACK_LENGTH else str(i))
            draw_text(screen, label, font_sm, WHITE if i not in (0, TRACK_LENGTH) else DARK_SLATE, tx, ty)

        # Draw players
        self.draw_player_token(1, self.p1_visual_pos, self.p1_char, positions, -14)
        self.draw_player_token(2, self.p2_visual_pos, self.p2_char, positions, 14)

        # HUD — Top bar
        hud_rect = pygame.Rect(0, 0, w, 56)
        hud_surf = pygame.Surface((w, 56), pygame.SRCALPHA)
        hud_surf.fill((0, 0, 0, 140))
        screen.blit(hud_surf, (0, 0))

        # Player info left
        p1c = self.p1_char or CHARACTERS[0]
        p2c = self.p2_char or CHARACTERS[1]
        marker = "▶" if self.current_player == 1 else " "
        draw_text(screen, f"{marker} J1: {p1c['name']}  Pos:{self.p1_pos}  Pts:{self.p1_score}", font_sm, (130, 180, 255), 10, 18, anchor="midleft")
        marker = "▶" if self.current_player == 2 else " "
        draw_text(screen, f"{marker} J2: {p2c['name']}  Pos:{self.p2_pos}  Pts:{self.p2_score}", font_sm, (255, 130, 130), 10, 38, anchor="midleft")

        # Timer
        if self.state == "playing" and not self.feedback:
            timer_color = RED if self.time_left <= 5 else GOLD
            draw_text(screen, f"⏱ {self.time_left}s", font_lg, timer_color, w - 60, 28)

        # Bottom bar buttons
        self.draw_bottom_bar(w, h)

        # Question panel (right side)
        if self.state == "playing":
            self.draw_question_panel(w, h)

        # Dice panel (right side)
        if self.state == "dice":
            self.draw_dice_panel(w, h)

        # Event overlay
        if self.state == "event" and self.special_event:
            self.draw_event_overlay(w, h)

    def draw_player_token(self, player, visual_pos, char_data, positions, offset_x):
        if char_data is None:
            return
        idx = int(visual_pos)
        frac = visual_pos - idx
        idx = max(0, min(idx, TRACK_LENGTH))
        next_idx = min(idx + 1, TRACK_LENGTH)

        x1, y1 = positions[idx]
        x2, y2 = positions[next_idx]
        x = x1 + (x2 - x1) * frac + offset_x
        y = y1 + (y2 - y1) * frac - 30

        # Bounce animation
        y += math.sin(self.animation_time * 0.08 + player * 2) * 3

        color = char_data["color"]
        # Shadow
        pygame.draw.ellipse(screen, (0, 0, 0, 60), (int(x) - 12, int(y) + 22, 24, 8))
        # Body
        pygame.draw.circle(screen, color, (int(x), int(y)), 16)
        pygame.draw.circle(screen, lerp_color(color, WHITE, 0.3), (int(x), int(y)), 12)
        # Player number
        draw_text(screen, str(player), font_sm, WHITE, int(x), int(y))

    def draw_bottom_bar(self, w, h):
        bar_w = 380
        bar_h = 44
        bar_x = (w - bar_w) // 2
        bar_y = h - 60
        bar_rect = pygame.Rect(bar_x, bar_y, bar_w, bar_h)

        bar_surf = pygame.Surface((bar_w, bar_h), pygame.SRCALPHA)
        pygame.draw.rect(bar_surf, (255, 255, 255, 220), (0, 0, bar_w, bar_h), border_radius=22)
        screen.blit(bar_surf, (bar_x, bar_y))
        pygame.draw.rect(screen, LIGHT_SLATE, bar_rect, width=2, border_radius=22)

        # Buttons: Reiniciar | Terminar
        btn_w = 120
        gap = 20
        total = btn_w * 2 + gap
        start_x = bar_x + (bar_w - total) // 2

        # Reiniciar
        self.btn_restart = pygame.Rect(start_x, bar_y + 6, btn_w, 32)
        mx, my = pygame.mouse.get_pos()
        c = BLUE if self.btn_restart.collidepoint(mx, my) else DARK_BLUE
        draw_text(screen, "🔄 Reiniciar", font_sm, c, self.btn_restart.centerx, self.btn_restart.centery)

        # Terminar
        self.btn_end = pygame.Rect(start_x + btn_w + gap, bar_y + 6, btn_w, 32)
        c = RED if self.btn_end.collidepoint(mx, my) else DARK_RED
        draw_text(screen, "⏹ Terminar", font_sm, c, self.btn_end.centerx, self.btn_end.centery)

    def draw_question_panel(self, w, h):
        panel_w = min(340, w // 3)
        panel_h = 380
        px = w - panel_w - 16
        py = 70
        panel_rect = pygame.Rect(px, py, panel_w, panel_h)

        # Semi-transparent background
        panel_surf = pygame.Surface((panel_w, panel_h), pygame.SRCALPHA)
        pygame.draw.rect(panel_surf, (255, 248, 230, 240), (0, 0, panel_w, panel_h), border_radius=18)
        screen.blit(panel_surf, (px, py))
        pygame.draw.rect(screen, AMBER, panel_rect, width=3, border_radius=18)

        # Current player
        cp = self.p1_char if self.current_player == 1 else self.p2_char
        cp = cp or CHARACTERS[0]
        color = BLUE if self.current_player == 1 else RED
        draw_text(screen, f"Vez: Jogador {self.current_player}", font_md, color, px + panel_w // 2, py + 25)

        # Question
        draw_text(screen, "Classifica o número:", font_sm, SLATE, px + panel_w // 2, py + 55)
        q_text = f'"{self.question[0]}"'
        q_h = draw_text(screen, q_text, font_sm, DARK_SLATE, px + panel_w // 2, py + 100, max_width=panel_w - 30)

        if self.feedback:
            # Feedback
            is_correct = self.feedback[0] == "correct"
            fb_color = GREEN if is_correct else RED
            bg_color = (220, 252, 231) if is_correct else (254, 226, 226)
            fb_rect = pygame.Rect(px + 12, py + 140, panel_w - 24, 60)
            draw_rounded_rect(screen, fb_rect, bg_color, 12, 2, fb_color)
            draw_text(screen, self.feedback[1], font_sm, fb_color, px + panel_w // 2, py + 170, max_width=panel_w - 40)
        else:
            # Answer buttons
            btn_y_start = py + 150
            self.answer_buttons = []
            for i, opt in enumerate(ANSWER_OPTIONS):
                btn_rect = pygame.Rect(px + 16, btn_y_start + i * 50, panel_w - 32, 40)
                self.answer_buttons.append((btn_rect, opt))

                mx, my = pygame.mouse.get_pos()
                is_hovered = btn_rect.collidepoint(mx, my)
                bg = (255, 251, 235) if is_hovered else WHITE
                border = AMBER if is_hovered else (200, 180, 140)
                draw_rounded_rect(screen, btn_rect, bg, 10, 2, border)
                draw_text(screen, ANSWER_LABELS[opt], font_md, DARK_SLATE, btn_rect.centerx, btn_rect.centery)

    def draw_dice_panel(self, w, h):
        panel_w = 240
        panel_h = 260
        px = w - panel_w - 16
        py = 70

        panel_surf = pygame.Surface((panel_w, panel_h), pygame.SRCALPHA)
        pygame.draw.rect(panel_surf, (30, 41, 59, 240), (0, 0, panel_w, panel_h), border_radius=18)
        screen.blit(panel_surf, (px, py))
        panel_rect = pygame.Rect(px, py, panel_w, panel_h)
        pygame.draw.rect(screen, SLATE, panel_rect, width=3, border_radius=18)

        draw_text(screen, "Lança o Dado!", font_lg, WHITE, px + panel_w // 2, py + 35)

        # Dice
        dice_size = 80
        dx = px + panel_w // 2 - dice_size // 2
        dy = py + 60
        dice_rect = pygame.Rect(dx, dy, dice_size, dice_size)
        draw_rounded_rect(screen, dice_rect, RED, 16, 4, DARK_RED)

        # Dots
        dots = self.get_dice_dots(self.dice_value, dx, dy, dice_size)
        for dot_pos in dots:
            pygame.draw.circle(screen, WHITE, dot_pos, 8)

        # Rolling text or button
        if self.dice_rolling:
            draw_text(screen, "A rodar...", font_md, GOLD, px + panel_w // 2, py + 170)
        elif self.feedback:
            draw_text(screen, self.feedback[1], font_sm, GREEN, px + panel_w // 2, py + 180, max_width=panel_w - 20)
        else:
            draw_text(screen, f"Tiraste {self.dice_value}!", font_lg, GOLD, px + panel_w // 2, py + 170)
            draw_text(screen, "A avançar...", font_sm, (180, 200, 180), px + panel_w // 2, py + 210)

    def get_dice_dots(self, face, dx, dy, size):
        cx, cy = dx + size // 2, dy + size // 2
        off = size // 4
        positions = {
            1: [(cx, cy)],
            2: [(cx - off, cy - off), (cx + off, cy + off)],
            3: [(cx - off, cy - off), (cx, cy), (cx + off, cy + off)],
            4: [(cx - off, cy - off), (cx + off, cy - off), (cx - off, cy + off), (cx + off, cy + off)],
            5: [(cx - off, cy - off), (cx + off, cy - off), (cx, cy), (cx - off, cy + off), (cx + off, cy + off)],
            6: [(cx - off, cy - off), (cx + off, cy - off), (cx - off, cy), (cx + off, cy), (cx - off, cy + off), (cx + off, cy + off)],
        }
        return positions.get(face, [])

    def draw_event_overlay(self, w, h):
        # Semi-transparent overlay
        overlay = pygame.Surface((w, h), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 120))
        screen.blit(overlay, (0, 0))

        panel_w, panel_h = 500, 200
        px = (w - panel_w) // 2
        py = (h - panel_h) // 2
        panel_rect = pygame.Rect(px, py, panel_w, panel_h)

        event = self.special_event
        if event["type"] in ("reset", "back"):
            bg = (254, 243, 199)
            border = AMBER
        else:
            bg = (220, 252, 231)
            border = GREEN

        draw_rounded_rect(screen, panel_rect, bg, 20, 6, border)
        draw_text(screen, "⚠️ CASA ESPECIAL!", font_lg, DARK_SLATE, w // 2, py + 50)
        draw_text(screen, event["text"], font_md, DARK_SLATE, w // 2, py + 110, max_width=panel_w - 40)
        draw_text(screen, "A continuar...", font_sm, SLATE, w // 2, py + 160)

    # ─── TELA DE FIM ─────────────────────────────────────────────────
    def draw_end_screen(self, w, h):
        # Background
        for i in range(h):
            t = i / h
            c = lerp_color((251, 191, 36), (245, 158, 11), t)
            pygame.draw.line(screen, c, (0, i), (w, i))

        # Confetti
        for c in self.confetti:
            c.draw(screen)

        # Panel
        panel_w = min(w - 40, 700)
        panel_h = min(h - 40, 520)
        px = (w - panel_w) // 2
        py = (h - panel_h) // 2
        panel_rect = pygame.Rect(px, py, panel_w, panel_h)
        draw_rounded_rect(screen, panel_rect, WHITE, 24, 6, DARK_GOLD)

        # Trophy animation
        trophy_y = py + 50 + math.sin(self.animation_time * 0.06) * 8
        draw_text(screen, "🏆", font_title, GOLD, w // 2, int(trophy_y))

        draw_text(screen, "VITÓRIA!", font_xl, DARK_GOLD, w // 2, py + 100)

        winner_char = self.p1_char if self.winner == 1 else self.p2_char
        winner_char = winner_char or CHARACTERS[0]
        winner_color = BLUE if self.winner == 1 else RED
        draw_text(screen, f"👑 {winner_char['name']} VENCEU!", font_lg, winner_color, w // 2, py + 150)

        # Stats cards
        cards_y = py + 190
        card_w = (panel_w - 60) // 2
        card_h = 150

        for pi, (char, score, pos, correct, wrong, pw) in enumerate([
            (self.p1_char, self.p1_score, self.p1_pos, self.p1_correct, self.p1_wrong, 1),
            (self.p2_char, self.p2_score, self.p2_pos, self.p2_correct, self.p2_wrong, 2),
        ]):
            char = char or CHARACTERS[pi]
            cx = px + 20 + pi * (card_w + 20)
            card_rect = pygame.Rect(cx, cards_y, card_w, card_h)

            is_winner = pw == self.winner
            border_c = GOLD if is_winner else LIGHT_SLATE
            bg = (255, 251, 235) if is_winner else WHITE
            draw_rounded_rect(screen, card_rect, bg, 14, 3, border_c)

            if is_winner:
                draw_text(screen, "👑", font_md, GOLD, cx + card_w // 2, cards_y + 18)

            draw_text(screen, char["name"], font_sm, DARK_SLATE, cx + card_w // 2, cards_y + 38)

            stats_x = cx + 16
            stats_y = cards_y + 58
            stats = [
                (f"⭐ Pontos: {score}", DARK_BLUE if pi == 0 else DARK_RED),
                (f"📍 Posição: {pos}/{TRACK_LENGTH}", DARK_BLUE if pi == 0 else DARK_RED),
                (f"✅ Acertos: {correct}", DARK_GREEN),
                (f"❌ Erros: {wrong}", DARK_RED),
            ]
            for j, (txt, col) in enumerate(stats):
                draw_text(screen, txt, font_sm, col, stats_x, stats_y + j * 22, anchor="midleft")

        # Buttons
        btn_y = cards_y + card_h + 20
        btn_w = (panel_w - 80) // 2
        btn_h = 44

        self.btn_replay = pygame.Rect(px + 20, btn_y, btn_w, btn_h)
        self.btn_change = pygame.Rect(px + 40 + btn_w, btn_y, btn_w, btn_h)

        mx, my = pygame.mouse.get_pos()

        # Jogar de Novo
        c = GREEN if self.btn_replay.collidepoint(mx, my) else DARK_GREEN
        draw_rounded_rect(screen, self.btn_replay, c, 22)
        draw_text(screen, "🔄 JOGAR DE NOVO", font_sm, WHITE, self.btn_replay.centerx, self.btn_replay.centery)

        # Mudar Personagens
        c = SLATE if self.btn_change.collidepoint(mx, my) else DARK_SLATE
        draw_rounded_rect(screen, self.btn_change, c, 22)
        draw_text(screen, "MUDAR PERSONAGENS", font_sm, WHITE, self.btn_change.centerx, self.btn_change.centery)

    # ─── CLICK HANDLING ──────────────────────────────────────────────
    def handle_click(self, pos):
        mx, my = pos

        if self.state in ("select_p1", "select_p2"):
            is_p1 = self.state == "select_p1"
            for i, char in enumerate(CHARACTERS):
                # Calculate card position (must match draw code)
                w, h = screen.get_size()
                pw = min(w - 40, 900)
                px_panel = (w - pw) // 2
                cols = 5
                card_w = (pw - 80) // cols
                card_h = 130
                start_x = px_panel + 40
                start_y = px_panel + 120 + ((h - min(h - 40, 520)) // 2 - px_panel) + 120
                # Recalculate properly
                ph = min(h - 40, 520)
                py_panel = (h - ph) // 2
                start_y = py_panel + 120

                col = i % cols
                row = i // cols
                cx = start_x + col * card_w + card_w // 2
                cy = start_y + row * (card_h + 12) + card_h // 2
                card_rect = pygame.Rect(cx - card_w // 2 + 4, cy - card_h // 2, card_w - 8, card_h)

                if card_rect.collidepoint(mx, my):
                    is_disabled = (not is_p1 and self.p1_char is not None and self.p1_char["id"] == char["id"])
                    if not is_disabled:
                        if is_p1:
                            self.p1_char = char
                            self.state = "select_p2"
                        else:
                            self.p2_char = char
                            self.state = "select_world"
                        break

        elif self.state == "select_world":
            w, h = screen.get_size()
            card_w = min((w - 100) // len(WORLDS), 220)
            total_w = card_w * len(WORLDS) + 16 * (len(WORLDS) - 1)
            start_x = (w - total_w) // 2
            card_h = 220

            for i, world in enumerate(WORLDS):
                cx = start_x + i * (card_w + 16) + card_w // 2
                cy = h // 2
                card_rect = pygame.Rect(cx - card_w // 2, cy - card_h // 2, card_w, card_h)
                if card_rect.collidepoint(mx, my):
                    self.world = world
                    self.start_game()
                    break

            # Back button
            back_rect = pygame.Rect(w // 2 - 60, h - 60, 120, 36)
            if back_rect.collidepoint(mx, my):
                self.state = "select_p2"

        elif self.state == "playing":
            # Check answer buttons
            if hasattr(self, 'answer_buttons') and not self.feedback:
                for btn_rect, opt in self.answer_buttons:
                    if btn_rect.collidepoint(mx, my):
                        self.handle_answer(opt)
                        break

            # Bottom bar
            if hasattr(self, 'btn_restart') and self.btn_restart.collidepoint(mx, my):
                self.start_game()
            if hasattr(self, 'btn_end') and self.btn_end.collidepoint(mx, my):
                self.end_game_manually()

        elif self.state == "dice":
            if hasattr(self, 'btn_restart') and self.btn_restart.collidepoint(mx, my):
                self.start_game()
            if hasattr(self, 'btn_end') and self.btn_end.collidepoint(mx, my):
                self.end_game_manually()

        elif self.state == "end":
            if hasattr(self, 'btn_replay') and self.btn_replay.collidepoint(mx, my):
                self.start_game()
            if hasattr(self, 'btn_change') and self.btn_change.collidepoint(mx, my):
                self.p1_char = None
                self.p2_char = None
                self.state = "select_p1"


# ─── LOOP PRINCIPAL ──────────────────────────────────────────────────
def main():
    global WIDTH, HEIGHT, screen

    game = NarniaGame()

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.VIDEORESIZE:
                WIDTH, HEIGHT = event.w, event.h
                screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
                game.tile_positions = generate_tile_positions()
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                game.handle_click(event.pos)
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False

        game.update()
        game.draw()
        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()
    sys.exit()


if __name__ == "__main__":
    main()
