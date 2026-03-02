import streamlit as st
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from backend.auth import get_image_history
from utils.styles import back_button

GRAD = [
    "linear-gradient(135deg,#1A1728,#201630)",
    "linear-gradient(135deg,#0F1A28,#0F2018)",
    "linear-gradient(135deg,#200F18,#1A1014)",
    "linear-gradient(135deg,#1A1420,#0F1428)",
    "linear-gradient(135deg,#201820,#0F1820)",
    "linear-gradient(135deg,#181428,#200F14)",
]


# ── GALLERY ──────────────────────────────────────────────────────────────────
def show_history_page():
    back_button("Back", "dashboard")
    user    = st.session_state.get("user", {})
    history = get_image_history(user.get("user_id", 0))

    st.markdown("""
    <div style="margin-bottom:24px;">
      <p style="font-family:'Syne Mono',monospace;font-size:.58rem;color:#3E3C58;
                text-transform:uppercase;letter-spacing:.18em;margin:0 0 8px;">Collection</p>
      <h2 style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;
                 color:#EEEAF8;margin:0;letter-spacing:-.04em;">My Gallery</h2>
    </div>
    """, unsafe_allow_html=True)

    if not history:
        st.markdown("""
        <div style="background:#0F0F18;border:1px solid rgba(255,255,255,.06);
                    border-radius:16px;padding:60px;text-align:center;">
          <p style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;
                    color:#3E3C58;margin:0 0 6px;">No artworks yet</p>
          <p style="font-family:'Outfit',sans-serif;font-size:.85rem;color:#3E3C58;margin:0;">
            Head to Art Studio to create your first artwork
          </p>
        </div>
        """, unsafe_allow_html=True)
        st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)
        if st.button("Go to Art Studio", type="primary", key="gal_cta"):
            st.session_state["page"] = "image_processing"; st.rerun()
        return

    # Style pills
    from collections import Counter
    sc     = Counter(h["style_applied"] for h in history)
    COLORS = ["#A78BFA","#F472B6","#60A5FA","#34D399","#FBBF24","#F87171"]
    pills  = "".join([
        f'<span style="font-family:Syne Mono,monospace;font-size:.58rem;letter-spacing:.07em;'
        f'text-transform:uppercase;padding:4px 10px;border-radius:99px;'
        f'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);'
        f'color:{COLORS[i%6]};margin-right:5px;">'
        f'{s.split(" ",1)[-1]}: {c}</span>'
        for i, (s, c) in enumerate(sc.most_common(6))
    ])
    st.markdown(
        f'<div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:20px;">'
        f'<span style="font-family:Syne Mono,monospace;font-size:.58rem;color:#3E3C58;'
        f'letter-spacing:.1em;text-transform:uppercase;margin-right:8px;">{len(history)} items</span>'
        f'{pills}</div>',
        unsafe_allow_html=True
    )

    # Grid
    CPR = 4
    for i in range(0, len(history), CPR):
        batch = history[i:i+CPR]
        cols  = st.columns(CPR)
        for j, (col, item) in enumerate(zip(cols, batch)):
            with col:
                ppath = item.get("processed_image_path", "")
                if ppath and os.path.exists(ppath):
                    st.image(ppath, use_container_width=True)
                else:
                    st.markdown(
                        f'<div style="aspect-ratio:.9;border-radius:12px;'
                        f'background:{GRAD[(i+j)%len(GRAD)]};display:flex;'
                        f'align-items:center;justify-content:center;font-size:2rem;'
                        f'border:1px solid rgba(255,255,255,.06);">&#128444;</div>',
                        unsafe_allow_html=True
                    )
                style = item.get("style_applied", "-")
                date  = (item.get("processing_date") or "")[:16]
                st.markdown(
                    f'<div style="padding:6px 0 14px;">'
                    f'<p style="font-family:Outfit,sans-serif;font-weight:600;'
                    f'font-size:.78rem;color:#EEEAF8;margin:0;">{style}</p>'
                    f'<p style="font-family:Syne Mono,monospace;font-size:.58rem;'
                    f'color:#3E3C58;margin:2px 0 0;">{date}</p></div>',
                    unsafe_allow_html=True
                )


# ── PROFILE ──────────────────────────────────────────────────────────────────
def show_profile_page():
    back_button("Back", "dashboard")
    user    = st.session_state.get("user", {})
    uname   = user.get("username", "-")
    initial = uname[0].upper() if uname else "?"
    history = get_image_history(user.get("user_id", 0))

    st.markdown("""
    <div style="margin-bottom:24px;">
      <p style="font-family:'Syne Mono',monospace;font-size:.58rem;color:#3E3C58;
                text-transform:uppercase;letter-spacing:.18em;margin:0 0 8px;">Account</p>
      <h2 style="font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;
                 color:#EEEAF8;margin:0;letter-spacing:-.04em;">Profile</h2>
    </div>
    """, unsafe_allow_html=True)

    avatar_col, details_col = st.columns([1, 2.2])

    with avatar_col:
        styles_used = len(set(h["style_applied"] for h in history)) if history else 0
        streak_days = 14

        st.markdown(f"""
        <div style="background:#0F0F18;border:1px solid rgba(255,255,255,.06);
                    border-radius:18px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.4);">
          <div style="height:80px;background:linear-gradient(135deg,#A78BFA,#F472B6);
                      position:relative;overflow:hidden;">
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(
              45deg,transparent,transparent 10px,rgba(0,0,0,.08) 10px,rgba(0,0,0,.08) 11px);"></div>
          </div>
          <div style="display:flex;justify-content:center;margin-top:-28px;position:relative;z-index:1;">
            <div style="width:56px;height:56px;border-radius:50%;
                        background:linear-gradient(135deg,#A78BFA,#F472B6);
                        display:flex;align-items:center;justify-content:center;
                        font-family:'Syne',sans-serif;font-weight:800;font-size:1.4rem;
                        color:#fff;border:3px solid #08080E;
                        box-shadow:0 0 20px rgba(167,139,250,.3);">{initial}</div>
          </div>
          <div style="padding:12px 20px 24px;text-align:center;">
            <p style="font-family:'Syne',sans-serif;font-weight:700;
                      font-size:1rem;color:#EEEAF8;margin:0 0 8px;">{uname}</p>
            <span style="font-family:'Syne Mono',monospace;font-size:.56rem;
                         letter-spacing:.08em;text-transform:uppercase;padding:4px 12px;
                         border-radius:99px;background:rgba(52,211,153,.06);
                         border:1px solid rgba(52,211,153,.2);color:#34D399;">
              Free Plan
            </span>
            <div style="display:flex;justify-content:space-around;
                        margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.05);">
              <div style="text-align:center;">
                <p style="font-family:'Syne',sans-serif;font-weight:800;
                           font-size:1.4rem;color:#EEEAF8;margin:0;">{len(history)}</p>
                <p style="font-family:'Syne Mono',monospace;font-size:.56rem;color:#3E3C58;
                           text-transform:uppercase;letter-spacing:.07em;margin:2px 0 0;">Images</p>
              </div>
              <div style="width:1px;background:rgba(255,255,255,.05);"></div>
              <div style="text-align:center;">
                <p style="font-family:'Syne',sans-serif;font-weight:800;
                           font-size:1.4rem;color:#EEEAF8;margin:0;">{styles_used}</p>
                <p style="font-family:'Syne Mono',monospace;font-size:.56rem;color:#3E3C58;
                           text-transform:uppercase;letter-spacing:.07em;margin:2px 0 0;">Styles</p>
              </div>
              <div style="width:1px;background:rgba(255,255,255,.05);"></div>
              <div style="text-align:center;">
                <p style="font-family:'Syne',sans-serif;font-weight:800;
                           font-size:1.4rem;color:#A78BFA;margin:0;">{streak_days}</p>
                <p style="font-family:'Syne Mono',monospace;font-size:.56rem;color:#A78BFA;
                           text-transform:uppercase;letter-spacing:.07em;margin:2px 0 0;">Streak</p>
              </div>
            </div>
          </div>
        </div>
        """, unsafe_allow_html=True)

    with details_col:
        fields = [
            ("Username",     user.get("username", "-")),
            ("Email",        user.get("email", "-")),
            ("Member Since", (user.get("created_at","") or "")[:10] or "-"),
            ("Last Login",   (user.get("last_login","") or "First visit")[:16]),
        ]
        rows_html = "".join([
            f'<div style="{"border-bottom:1px solid rgba(255,255,255,.04);" if i < len(fields)-1 else ""}padding:14px 20px;">'
            f'<p style="font-family:Syne Mono,monospace;font-size:.56rem;color:#3E3C58;'
            f'text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;">{lbl}</p>'
            f'<p style="font-family:Outfit,sans-serif;font-weight:600;'
            f'font-size:.9rem;color:#EEEAF8;margin:0;">{val}</p></div>'
            for i, (lbl, val) in enumerate(fields)
        ])

        st.markdown(f"""
        <div style="background:#0F0F18;border:1px solid rgba(255,255,255,.06);
                    border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.3);">
          <div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.05);">
            <p style="font-family:'Syne Mono',monospace;font-size:.58rem;color:#3E3C58;
                      text-transform:uppercase;letter-spacing:.1em;margin:0;">Account Details</p>
          </div>
          {rows_html}
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<div style='height:12px'></div>", unsafe_allow_html=True)

        st.markdown("""
        <div style="background:rgba(96,165,250,.05);border:1px solid rgba(96,165,250,.12);
                    border-left:3px solid #60A5FA;border-radius:10px;padding:12px 16px;
                    margin-bottom:10px;">
          <p style="font-family:'Outfit',sans-serif;color:#EEEAF8;font-size:.84rem;margin:0;">
            Password change and advanced settings coming in the next version.
          </p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <div style="background:rgba(244,114,182,.04);border:1px solid rgba(244,114,182,.1);
                    border-radius:12px;padding:16px 20px;">
          <p style="font-family:'Syne Mono',monospace;font-size:.56rem;
                    color:rgba(244,114,182,.5);text-transform:uppercase;
                    letter-spacing:.1em;margin:0 0 10px;">Danger Zone</p>
        </div>
        """, unsafe_allow_html=True)

        d1, d2 = st.columns(2)
        with d1:
            st.button("Change Password", use_container_width=True, key="chpw_btn")
        with d2:
            st.button("Delete Account", use_container_width=True, key="del_btn")