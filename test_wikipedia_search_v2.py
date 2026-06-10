import json
import urllib.request
import urllib.parse
import time

attractions = [
    'Farol do Cabo Branco', 'Praia de Tambaú', 'Centro Cultural São Francisco', 'Parque Solon de Lucena', 
    'Mercado de Artesanato Paraibano', 'Praia do Jacaré', 'Piscinas Naturais do Seixas', 'Estação Cabo Branco', 
    'Praia de Coqueirinho', 'Praia de Tambaba', 'Ilha de Areia Vermelha', 'Hotel Globo', 
    'Bica (Parque Arruda Câmara)', 'Praia do Bessa', 'Feirinha de Tambaú', 'Praia de Cabo Branco', 
    'Casa da Pólvora', 'Praia de Tabatinga', 'Praia Bela', 'Mosteiro de São Bento', 
    'Centro Histórico (Praça Antenor Navarro)', 'Praia do Amor', 'Praia de Carapibus', 'Ponta de Campina', 
    'Praia de Intermares', 'Jardim Botânico Benjamin Maranhão', 'Planetário do Espaço Cultural', 'Restaurante Mangai', 
    'Bar do Cuscuz', 'Skybar Tour Geneve', 'Mercado Público de Mangabeira', 'Largo de São Frei Pedro Gonçalves', 
    'Catedral Metropolitana de Nossa Senhora das Neves', 'Praia de Barra de Gramame', 'Ladeira da Borborema', 
    'Igreja de Nossa Senhora do Carmo', 'Igreja da Misericórdia', 'Praia de Manaíra', 'Praia do Seixas', 
    'Praia da Penha', 'Praia de Jacarapé', 'Praia do Sol', 'Praia de Camboinha', 'Praia do Poço', 
    'Praia de Areia Dourada', 'Praia Formosa', 'Praia de Miramar', 'Praia de Jacumã', 'Praia de Barra de Graú', 
    'Praia de Pitimbu', 'Praia de Lucena', 'Praia de Ponta de Lucena', 'Praia de Camaçari', 
    'Igreja de Nossa Senhora da Guia', 'Forte de Santa Catarina', 'Santuário de Nossa Senhora da Penha', 
    'Praça João Pessoa', 'Praça Pedro Américo', 'Praça Venâncio Neiva', 'Praça da Independência', 
    'Teatro Santa Roza', 'Casarão dos Azulejos', 'Academia Paraibana de Letras', 'Palácio da Redenção', 
    'Casa do Artista Popular', 'Museum of Sacred Art of Paraíba', 'Igreja de Santa Terezinha', 
    'Mirante do Dedo de Deus', 'Canyon de Coqueirinho', 'Bosque dos Sonhos', 'Parque das Três Ruas', 
    'Parque Ecológico Sanhauá', 'Parque Parahyba I', 'Parque Parahyba II', 'Parque Parahyba III', 
    'Lovina Beach Club', 'Restaurante Canoa dos Camarões', 'Gulliver Mar', 'Restaurante NAU Frutos do Mar', 
    'Orama Rooftop', 'Quintal do Cuscuz', 'Boteco Cabo Branco', 'Praiano Bar', 'Lovina Ponta de Campina', 
    'Shopping Manaíra', 'Shopping Mangabeira', 'Centro de Turismo de Tambaú', 'Mercado Público da Torre', 
    'Mercado Público de Tambaú', 'Galeria de Artesanato da orla', 'Sereia de Carapibus', 'Ponta do Seixas', 
    'Mirante de Tambaba', 'Paróquia Santo Antônio de Pádua', 'Igreja Nossa Senhora do Rosário', 
    'Igreja de São Bento', 'Igreja de São Francisco', 'Parque Ecológico Bosque dos Sonhos', 
    'Canyon do Coqueirinho', 'Castelo da Princesa', 'Mirante Sky Beach', 'Parque Três Ruas', 
    'Centro Turístico de Tambaú', 'Mercado de Artesanato de Tambaú', 'Estação das Artes'
]

def search_wikipedia_image_refined(query):
    # Dicionário de mapeamentos para nomes de páginas mais conhecidas
    custom_mapping = {
        "Farol do Cabo Branco": "Farol de Cabo Branco",
        "Centro Cultural São Francisco": "Centro Cultural São Francisco (João Pessoa)",
        "Parque Solon de Lucena": "Parque Sólon de Lucena",
        "Bica (Parque Arruda Câmara)": "Parque Arruda Câmara",
        "Estação Cabo Branco": "Estação Cabo Branco",
        "Hotel Globo": "Hotel Globo (João Pessoa)",
        "Mosteiro de São Bento": "Mosteiro de São Bento (João Pessoa)",
        "Casa da Pólvora": "Casa da Pólvora (João Pessoa)",
        "Centro Histórico (Praça Antenor Navarro)": "Centro Histórico de João Pessoa",
        "Teatro Santa Roza": "Teatro Santa Roza",
        "Casarão dos Azulejos": "Casarão dos Azulejos (João Pessoa)",
        "Palácio da Redenção": "Palácio da Redenção",
        "Forte de Santa Catarina": "Forte de Santa Catarina do Cabedelo",
        "Igreja de Nossa Senhora da Guia": "Igreja de Nossa Senhora da Guia (Lucena)",
        "Catedral Metropolitana de Nossa Senhora das Neves": "Catedral Metropolitana de João Pessoa de Nossa Senhora das Neves",
        "Igreja de Nossa Senhora do Carmo": "Igreja de Nossa Senhora do Carmo (João Pessoa)",
        "Igreja da Misericórdia": "Igreja da Misericórdia (João Pessoa)",
        "Praia do Jacaré": "Praia do Jacaré (Paraíba)",
        "Ilha de Areia Vermelha": "Parque Estadual Marinho de Areia Vermelha",
        "Jardim Botânico Benjamin Maranhão": "Jardim Botânico Benjamin Maranhão",
        "Praça João Pessoa": "Praça João Pessoa (João Pessoa)",
        "Praça Pedro Américo": "Praça Pedro Américo (João Pessoa)",
        "Praça Venâncio Neiva": "Praça Venâncio Neiva (João Pessoa)",
        "Praça da Independência": "Praça da Independência (João Pessoa)",
        "Praia de Tambaba": "Tambaba",
        "Santuário de Nossa Senhora da Penha": "Santuário de Nossa Senhora da Penha (João Pessoa)",
        "Academia Paraibana de Letras": "Academia Paraibana de Letras",
        "Ponta do Seixas": "Ponta do Seixas",
        "Praia do Seixas": "Ponta do Seixas",
        "Praia de Coqueirinho": "Conde (Paraíba)", # Coqueirinho é no Conde
        "Praia de Carapibus": "Conde (Paraíba)",
        "Praia de Tabatinga": "Conde (Paraíba)",
        "Praia do Amor": "Conde (Paraíba)",
        "Praia de Jacumã": "Conde (Paraíba)",
        "Mirante de Tambaba": "Tambaba"
    }
    
    search_term = custom_mapping.get(query, query)
    
    # 1. Tentar primeiro busca exata de título na wikipedia em português
    try:
        params = {
            "action": "query",
            "format": "json",
            "prop": "pageimages",
            "piprop": "original",
            "titles": search_term
        }
        url = "https://pt.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "ExploraeDatabaseEnricher/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            pages = res_data.get("query", {}).get("pages", {})
            for page_id, page in pages.items():
                if page_id != "-1" and "original" in page:
                    img_url = page["original"].get("source")
                    if img_url and not img_url.endswith('.svg') and not 'map' in img_url.lower():
                        return img_url, "exact_title"
    except Exception:
        pass
        
    # 2. Tentar busca textual se a busca por título exato falhar
    try:
        # Se for praia ou igreja, adiciona Paraíba para o escopo
        query_search = search_term
        if "praia" in query_search.lower() or "igreja" in query_search.lower() or "parque" in query_search.lower():
            if "paraíba" not in query_search.lower() and "pb" not in query_search.lower():
                query_search += " Paraíba"
                
        params = {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": query_search,
            "gsrlimit": 5,
            "prop": "pageimages",
            "piprop": "original"
        }
        url = "https://pt.wikipedia.org/w/api.php?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "ExploraeDatabaseEnricher/1.0"})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            pages = res_data.get("query", {}).get("pages", {})
            
            # Ordena os resultados por index retornado (que representa o ranking da busca)
            sorted_pages = sorted(pages.values(), key=lambda x: x.get("index", 100))
            for page in sorted_pages:
                if page.get("pageid", -1) != -1 and "original" in page:
                    img_url = page["original"].get("source")
                    # Ignora mapas SVG e bandeiras
                    if img_url and not img_url.endswith('.svg') and not 'map' in img_url.lower() and not 'bandeira' in img_url.lower() and not 'brasão' in img_url.lower() and not 'coat_of_arms' in img_url.lower():
                        return img_url, "search_fallback"
    except Exception:
        pass
        
    return None, "not_found"

print("Iniciando varredura refinada...")
results = {}
for i, name in enumerate(attractions):
    img, method = search_wikipedia_image_refined(name)
    results[name] = {"image": img, "method": method}
    print(f"[{i+1}/105] {name}: {method} -> {img}")
    time.sleep(0.1)

with open("wikipedia_images_refined.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=4)
print("Concluído! Salvo em 'wikipedia_images_refined.json'")
