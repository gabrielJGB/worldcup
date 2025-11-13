export default function handler(req, res) {

    const routes = ["award_winners",
        "awards",
        "bookings",
        "confederations",
        "goals",
        "group_standings",
        "groups",
        "host_countries",
        "manager_appearances",
        "manager_appointments",
        "managers",
        "matches",
        "penalty_kicks",
        "player_appearances",
        "players",
        "qualified_teams",
        "referee_appearances",
        "referee_appointments",
        "referees",
        "squads",
        "stadiums",
        "substitutions",
        "team_appearances",
        "teams",
        "tournament_stages",
        "tournament_standings"]

    res.status(200).json({
        message: "Bienvenido a mi API sobre la Copa Mundial de Futbol. Las rutas disponibles son las siguientes:",
        routes:routes.map(route=>("/api/"+route))
    });
}
