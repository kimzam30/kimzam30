<p align="center">
  <img src="assets/posters/banner.png" alt="Hakim Zamri, Co-founder and CTO at Omni Systems. Three ecosystems: Nhako, Omni Systems and Homelab26." width="100%" />
</p>

<p align="center">
  <a href="https://www.omnisystems.my"><img src="https://img.shields.io/badge/Omni_Systems-omnisystems.my-141414?style=for-the-badge&logo=vercel&logoColor=white" alt="Omni Systems" /></a>
  <a href="https://nhako.com"><img src="https://img.shields.io/badge/Nhako-nhako.com-CF1780?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Nhako" /></a>
  <a href="https://www.linkedin.com/in/hakim-zamri-3686082b2"><img src="https://img.shields.io/badge/LinkedIn-Hakim_Zamri-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="mailto:hakimzamri.omni@gmail.com"><img src="https://img.shields.io/badge/Email-Contact-1a1a1a?style=for-the-badge&logo=maildotru&logoColor=white" alt="Email" /></a>
</p>

---

## About

Co-founder and CTO at [Omni Systems](https://www.omnisystems.my), where I lead backend architecture, data and infrastructure. IT undergraduate and full-stack developer working across the whole stack, from Next.js product surfaces down to the Docker hosts and Linux boxes they run on.

Outside the day job I run **Nhako**, a one-person workshop of products that run on your own device, and a documented homelab that doubles as staging and storage. I care about systems that stay maintainable a year later, not demos that look good for a week.

| | |
|---|---|
| **Just shipped** | [Nhako Tools 1.0](https://tools.nhako.com): 50 browser tools with no upload step, in English and Bahasa Melayu. |
| **Currently building** | [Octomations](https://www.octomations.com) and [Intrafluence](https://www.intrafluence.com) at Omni Systems, and [NhakoSearch](https://search.nhako.com) on the side. |
| **Working in** | TypeScript, Next.js, PostgreSQL, Supabase, Cloudflare R2, Vercel. |
| **Also running** | A self-hosted homelab of 19 containers across 9 Docker Compose projects, with private services reachable only over Tailscale. |
| **Studying** | Operating systems, OOP and data structures, and low-level C/C++ alongside the product work. |

---

## Three Ecosystems

<p align="center">
  <a href="assets/posters/nhako.png"><img src="assets/posters/nhako.png" alt="Nhako poster: things that run on your own device" width="32%" /></a>
  <a href="assets/posters/omni.png"><img src="assets/posters/omni.png" alt="Omni Systems poster: build systems, not short-term fixes" width="32%" /></a>
  <a href="assets/posters/homelab.png"><img src="assets/posters/homelab.png" alt="Homelab26 poster: one box, two front doors" width="32%" /></a>
</p>

<p align="center"><sub>Tap a poster for the full size. Source and render script live in <a href="launch/"><code>launch/</code></a>.</sub></p>

### 01 &nbsp;Nhako

Things that run on your own device. Every product lives at **[nhako.com](https://nhako.com)**.

| Product | What it is |
|---|---|
| **[Nhako Tools](https://tools.nhako.com)**<br/><sub>Live</sub> | 50 PDF, image, media, calculator and developer tools that run entirely in the browser. Nothing uploads, so nothing waits: no queue, no size cap, no account. Installs as an app and works offline.<br/>`Astro 5` `Preact` `TypeScript` `WASM` |
| **[NhakoSearch](https://search.nhako.com)**<br/><sub>Live</sub> | A cozy, hand-drawn word-search game for two: a daily puzzle, a 360-level path, 12 themes, and realtime race or co-op. Seeded generation guarantees both players an identical board.<br/>`Next.js 16` `Supabase` `Realtime` |
| **[NhakoCapture](https://github.com/kimzam30/NhakoCapture)**<br/><sub>v2.0, load unpacked</sub> | Opera's one-keystroke screenshot rebuilt for Brave and Chrome. Freeze the page, frame a region, annotate, copy. Whole page to PNG or PDF, real redaction, no network calls.<br/>`JavaScript` `Manifest V3` |
| **[Nhako Bot](https://github.com/kimzam30/Nhako-Bot)**<br/><sub>Self-host</sub> | Telegram assistant that runs on your own hardware: Llama 3.2 through Ollama, pgvector long-term memory and offline voice transcription with faster-whisper.<br/>`Python` `Ollama` `pgvector` |
| **[Nhako Beam](https://github.com/kimzam30/Nhako-beam)**<br/><sub>Planning</sub> | Direct file transfer with no cloud, no size cap and no account. Peer to peer first, a self-hosted Docker relay only when the network leaves no other way.<br/>`Rust` `QUIC` `Tauri` |

### 02 &nbsp;Omni Systems

Four production systems on one core: one identity, one data spine, one set of workflows. Source is private; links go to the live systems.

| System | What it is |
|---|---|
| **Octomations**<br/><sub>[octomations.com](https://www.octomations.com)</sub> | Modular business operating system with industry systems for clinics, education, retail, restaurants and more. |
| **Intrafluence**<br/><sub>[intrafluence.com](https://www.intrafluence.com)</sub> | A structured place for brands and creators to find each other and agree on paid work, with consent before contact enforced in the database. |
| **Kentra**<br/><sub>[kentra.app](https://kentra.app)</sub> | Unified digital life system focused on identity, continuity and long-term context across digital activity. |
| **TrueSelf**<br/><sub>[mytrueself.app](https://mytrueself.app)</sub> | Awareness system for self assessment, growth tracking and development plans. |
| **Omni App line**<br/><sub>[omnisystems.my](https://www.omnisystems.my)</sub> | Small single-purpose apps beside the production systems: Tools in limited release, with Money, Copy, Docs and Plan in development. The company site is the front door to all of it. |

### 03 &nbsp;Homelab and Self-Hosting

One box, two front doors. The machines under the desk and the software on them, written up so they can be rebuilt.

| Project | Description |
|---|---|
| **[Homelab26](https://github.com/kimzam30/Homelab26)** | Current homelab: 19 containers across 9 Compose projects and 5 Docker networks on one box. Private household services over Tailscale; a public Minecraft server (Fabric, 138 mods) and its website behind a separate reverse proxy with no route to anything private. Four backup layers and nine documents cover the whole machine.<br/>`Docker` `Tailscale` `restic` `WSL2` |
| **[Remote-Dev-Setup](https://github.com/kimzam30/Remote-Dev-Setup)** | Portable, containerized VS Code Server for coding from any device, with Python and C++ toolchains, NAS mounts and Tailscale access.<br/>`Docker` `Python` `C++` `SSH` |
| **[my-linux-setup](https://github.com/kimzam30/my-linux-setup)** | Zorin OS on a Dell XPS 15 9500: hardware fixes, TLP power tuning, Tailscale mesh and low-latency game streaming via Sunshine.<br/>`Bash` `Shell` `Linux` |
| **[my-homelab-setup](https://github.com/kimzam30/my-homelab-setup)** | The first homelab: Homepage, FileBrowser, Pi-hole, Jellyfin, Gitea, Speedtest Tracker and Uptime Kuma behind Nginx. Superseded by Homelab26, kept as a reference build.<br/>`Docker` `Nginx` `Self-hosted` |

### Smaller Things

| Project | Description |
|---|---|
| **[Project-Nera](https://github.com/kimzam30/Project-Nera)** | A personal letter delivered as a retro terminal session: typewriter text, music and a timed image reveal in one HTML file.<br/>`Vanilla JS` `CSS` `HTML` |
| **[butterfly-word-search](https://butterflywordsearch.web.app)** | The original realtime multiplayer word search, an offline-capable PWA with a server-validated game engine. Since rebuilt as NhakoSearch.<br/>`Vanilla JS` `Firebase` `PWA` |
| **[Study-Cplusplus-in-7-days](https://github.com/kimzam30/Study-Cplusplus-in-7-days)** | A self-directed sprint through C++ fundamentals, pointers to stacks, one topic a day, each a small program that compiles.<br/>`C++17` `OOP` |

---

## How the Work Fits Together

```mermaid
flowchart TD
    UI["Product surfaces<br/>Next.js · Astro · TypeScript"]
    APP["Application layer<br/>Server actions · Edge functions · WebAssembly"]
    DATA["Data layer<br/>PostgreSQL · Supabase · Row-level security"]
    OBJ["Object storage<br/>Cloudflare R2"]
    RUN["Runtime<br/>Vercel · Docker Compose · Nginx"]
    NET["Private network<br/>Tailscale mesh"]

    UI --> APP
    APP --> DATA
    APP --> OBJ
    UI --> RUN
    RUN --> NET
```

---

## Activity

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kimzam30/kimzam30/main/assets/contributions-dark.svg" />
    <img src="https://raw.githubusercontent.com/kimzam30/kimzam30/main/assets/contributions-light.svg" alt="Contribution activity over the past year" width="100%" />
  </picture>
  <br/><br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/kimzam30/kimzam30/main/assets/languages-dark.svg" />
    <img src="https://raw.githubusercontent.com/kimzam30/kimzam30/main/assets/languages-light.svg" alt="Language distribution across all repositories" width="100%" />
  </picture>
</div>

<p align="center"><sub>Generated weekly from the GitHub API and committed to this repository, so the graphs are served by GitHub itself rather than a third-party card service.</sub></p>

---

## Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=ts,js,react,nextjs,astro,tailwind,html,css&theme=dark" alt="Frontend" />
  <br/><br/>
  <img src="https://skillicons.dev/icons?i=python,java,cpp,c,postgres,supabase,firebase&theme=dark" alt="Backend and languages" />
  <br/><br/>
  <img src="https://skillicons.dev/icons?i=linux,docker,nginx,bash,git,cloudflare,vercel,vscode&theme=dark" alt="Infrastructure and tooling" />
</div>

---

## Contact

| | |
|---|---|
| **Company** | [Omni Systems Sdn. Bhd.](https://www.omnisystems.my) · [@omnisystemsmy](https://github.com/omnisystemsmy) |
| **Workshop** | [nhako.com](https://nhako.com) |
| **Email** | [hakimzamri.omni@gmail.com](mailto:hakimzamri.omni@gmail.com) |
| **LinkedIn** | [hakim-zamri](https://www.linkedin.com/in/hakim-zamri-3686082b2) |
| **Location** | Selangor, Malaysia |

<p align="center"><sub>Open to collaboration on systems, infrastructure, and full-stack product work.</sub></p>
