#!/bin/bash
cd "/Users/carlos/Documents/HTML CONTROL CLINICA"
git add .
git commit -m "Actualización $(date '+%Y-%m-%d %H:%M')"
git push
echo ""
echo "✅ Sincronización completada. Cierra esta ventana."

