const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { prisma } = require('./prisma-client');

async function main() {
  console.log('--- Iniciando Seed da Base de Dados da Atlas Materials ---');

  // 1. Limpar dados anteriores (se existirem)
  await prisma.quoteAttachment.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.project.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // 2. Administrador Principal
  const passwordHash = await bcrypt.hash('Admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Atlas',
      email: 'admin@atlasmaterials.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`✓ Administrador criado: ${admin.email}`);

  // 3. Definições Globais do Sistema
  await prisma.setting.create({
    data: {
      id: 'singleton',
      companyName: 'Atlas Materials',
      whatsappNumber: '258874438819',
      contactEmail: 'comercial@atlasmaterials.com',
      contactPhone: '+258 87 443 8819',
      address: 'Avenida Principal, Maputo, Moçambique',
    },
  });
  console.log('✓ Definições globais configuradas');

  // 4. Marcas Parceiras
  const brandAtlas = await prisma.brand.create({
    data: {
      name: 'Atlas Prime',
      slug: 'atlas-prime',
      description: 'Linha exclusiva de excelência e alta durabilidade da Atlas Materials.',
    },
  });

  const brandCeramica = await prisma.brand.create({
    data: {
      name: 'Atlas Ceramica',
      slug: 'atlas-ceramica',
      description: 'Porcelanatos e revestimentos cerâmicos retificados de padrão internacional.',
    },
  });

  const brandSanit = await prisma.brand.create({
    data: {
      name: 'Sanit Gold',
      slug: 'sanit-gold',
      description: 'Louças sanitárias ergonómicas, ecológicas e de design contemporâneo.',
    },
  });

  const brandHydro = await prisma.brand.create({
    data: {
      name: 'HydroTech Faucets',
      slug: 'hydrotech',
      description: 'Misturadoras e torneiras com cartuchos cerâmicos de alta precisão e economia de água.',
    },
  });

  // 5. Categorias
  const catSanitaria = await prisma.category.create({
    data: {
      name: 'Loiça Sanitária',
      slug: 'loica-sanitaria',
      description: 'Sanitas suspensas, compactas, lavatórios de pousar e encastrar, bidés e louças de requinte.',
      imageUrl: '/uploads/products/loica-sanitaria/20260914_172849_001.webp',
      orderIndex: 1,
    },
  });

  const catPortas = await prisma.category.create({
    data: {
      name: 'Portas & Painéis',
      slug: 'portas',
      description: 'Portas interiores, portas blindadas de segurança, portas de madeira maciça e acabamentos.',
      imageUrl: '/uploads/products/portas/20260915_153055.webp',
      orderIndex: 2,
    },
  });

  const catTijoleiras = await prisma.category.create({
    data: {
      name: 'Tijoleiras & Porcelanatos',
      slug: 'tijoleiras',
      description: 'Pavimentos e revestimentos cerâmicos, porcelanatos polidos, antiderrapantes e grande formato.',
      imageUrl: '/uploads/products/tijoleiras/20260915_152845.webp',
      orderIndex: 3,
    },
  });

  const catTorneiras = await prisma.category.create({
    data: {
      name: 'Torneiras & Misturadoras',
      slug: 'torneiras',
      description: 'Misturadoras monocomando para lavatório, duche, banheira e torneiras gourmet de cozinha.',
      imageUrl: '/uploads/products/torneiras/20260914_172639.webp',
      orderIndex: 4,
    },
  });

  console.log('✓ Categorias e Marcas criadas');

  // 6. Carregar Manifest de Imagens Reais se existir
  const manifestPath = path.join(__dirname, '..', 'public', 'uploads', 'manifest.json');
  let manifest = [];
  if (fs.existsSync(manifestPath)) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      console.warn('Não foi possível ler manifest.json:', e.message);
    }
  }

  function getImagesForCategory(categorySlug) {
    return manifest.filter(m => m.categorySlug === categorySlug);
  }

  // --- 7. Produtos Reais: Loiça Sanitária ---
  const sanImages = getImagesForCategory('loica-sanitaria');
  const prodSanita1 = await prisma.product.create({
    data: {
      name: 'Sanita Suspensa Rimless Atlas Elegance',
      slug: 'sanita-suspensa-rimless-atlas-elegance',
      sku: 'ATL-SAN-001',
      categoryId: catSanitaria.id,
      brandId: brandSanit.id,
      description: 'Sanita suspensa com sistema Rimless (sem rebordo) para máxima higiene, fácil limpeza e descarga eficiente de água. Cerâmica vitrificada com acabamento branco brilhante de alta resistência a riscos e manchas.',
      shortDescription: 'Sanita suspensa de design moderno com tecnologia Rimless e tampo amortecido Soft-Close.',
      price: 85000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: true,
      dimensions: '540 x 360 x 350 mm',
      technicalSpecs: JSON.stringify({
        'Material': 'Cerâmica Vitrificada Sanitária de Alta Densidade',
        'Tipo de Descarga': 'Dual Flush 3/4.5 Litros Rimless',
        'Tampo': 'Termodur com fecho suave (Soft-Close)',
        'Fixação': 'Oculta / Encastrada na parede',
        'Garantia': '5 Anos Atlas Materials'
      }),
      images: {
        create: sanImages.slice(0, 7).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Sanita Suspensa Rimless Atlas Elegance - Foto ${idx + 1}`
        }))
      }
    }
  });

  const prodSanita2 = await prisma.product.create({
    data: {
      name: 'Conjunto Sanitário Compacto Atlas Modern',
      slug: 'conjunto-sanitario-compacto-atlas-modern',
      sku: 'ATL-SAN-002',
      categoryId: catSanitaria.id,
      brandId: brandSanit.id,
      description: 'Conjunto completo monobloco com autoclismo acoplado, mecanismo de dupla descarga económica e curvas anatómicas. Ideal para residências e empreendimentos comerciais de alto padrão.',
      shortDescription: 'Sanita compacta monobloco com autoclismo ecológico e mecanismo de dupla descarga.',
      price: 110000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: true,
      dimensions: '660 x 375 x 790 mm',
      technicalSpecs: JSON.stringify({
        'Material': 'Porcelana Sanitária Premium',
        'Volume de Descarga': '3 / 6 Litros economizadores',
        'Entrada de Água': 'Inferior / Lateral',
        'Evacuação': 'Dual (Chão ou Parede)'
      }),
      images: {
        create: sanImages.slice(7, 15).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Conjunto Sanitário Compacto - Foto ${idx + 1}`
        }))
      }
    }
  });

  const prodLavatorio = await prisma.product.create({
    data: {
      name: 'Lavatório de Pousar Oval Cerâmico Atlas Luxury',
      slug: 'lavatorio-pousar-oval-atlas-luxury',
      sku: 'ATL-SAN-003',
      categoryId: catSanitaria.id,
      brandId: brandAtlas.id,
      description: 'Lavatório de pousar para bancada com linhas orgânicas e acabamento acetinado de alta durabilidade. Transforma qualquer casa de banho num ambiente spa sofisticado.',
      shortDescription: 'Lavatório de bancada elegante com design contemporâneo e toque aveludado.',
      price: 45000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: false,
      dimensions: '500 x 380 x 140 mm',
      technicalSpecs: JSON.stringify({
        'Instalação': 'De Pousar em Bancada',
        'Furo para Torneira': 'Sem furo (compatível com misturadora de bica alta ou parede)',
        'Válvula': 'Compatível com válvula Click-Clack universal'
      }),
      images: {
        create: sanImages.slice(15, 28).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Lavatório de Pousar - Foto ${idx + 1}`
        }))
      }
    }
  });

  // --- 8. Produtos Reais: Portas ---
  const portasImages = getImagesForCategory('portas');
  await prisma.product.create({
    data: {
      name: 'Porta de Interior Madeira Nobre Acabamento Natural',
      slug: 'porta-interior-madeira-nobre-acabamento-natural',
      sku: 'ATL-POR-001',
      categoryId: catPortas.id,
      brandId: brandAtlas.id,
      description: 'Porta maciça com folheado de madeira de lei selecionada, núcleo isolante termoacústico e aro em madeira tratada contra humidade e empeno. Acompanha fechadura magnética e dobradiças ocultas.',
      shortDescription: 'Porta maciça de interior com isolamento acústico e dobradiças invisíveis.',
      price: 135000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: true,
      dimensions: '2100 x 800 x 40 mm (medidas personalizáveis sob encomenda)',
      technicalSpecs: JSON.stringify({
        'Estrutura': 'Maciça / Honeycomb Acústico',
        'Acabamento': 'Verniz Poliuretano UV de Alta Resistência',
        'Aro e Guarnições': 'Reguláveis até 15 cm de espessura de parede',
        'Fechadura': 'Magnética silenciosa'
      }),
      images: {
        create: portasImages.map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Porta Madeira Nobre - Foto ${idx + 1}`
        }))
      }
    }
  });

  // --- 9. Produtos Reais: Tijoleiras / Porcelanatos (Com Calculadora m²) ---
  const tijoleirasImages = getImagesForCategory('tijoleiras');
  await prisma.product.create({
    data: {
      name: 'Porcelanato Polido Retificado Calacatta Gold 60x120cm',
      slug: 'porcelanato-polido-calacatta-gold-60x120',
      sku: 'ATL-TIJ-001',
      categoryId: catTijoleiras.id,
      brandId: brandCeramica.id,
      description: 'Porcelanato esmaltado polido de grande formato com veios dourados e cinzentos de inspiração mármore Calacatta. Bordos retificados que permitem juntas mínimas de 1mm proporcionando sensação de continuidade visual perfeita.',
      shortDescription: 'Porcelanato retificado premium de grande formato 60x120 cm com veios mármore nobres.',
      price: 18500, // Preço por m²
      unit: 'm²',
      isPerSquareMeter: true,
      isAvailable: true,
      isFeatured: true,
      dimensions: '60 x 120 cm (Espessura 9.5 mm)',
      technicalSpecs: JSON.stringify({
        'Superfície': 'Polido Espelhado Alto Brilho',
        'Acabamento de Borda': 'Retificado (Junta 1mm - 1.5mm)',
        'Resistência ao Desgaste (PEI)': 'PEI 4 (Alto tráfego residencial e comercial moderado)',
        'Absorção de Água': '≤ 0.1% (Resistente ao gelo e humidade)',
        'Peças por Caixa': '2 peças (1.44 m² por caixa)'
      }),
      images: {
        create: tijoleirasImages.slice(0, 3).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Porcelanato Calacatta Gold 60x120 - Foto ${idx + 1}`
        }))
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'Tijoleira Cerâmica Rústica Antiderrapante 60x60cm',
      slug: 'tijoleira-ceramica-rustica-antiderrapante-60x60',
      sku: 'ATL-TIJ-002',
      categoryId: catTijoleiras.id,
      brandId: brandCeramica.id,
      description: 'Pavimento cerâmico com textura antiderrapante classe R11, ideal para áreas exteriores, varandas, garagens e zonas húmidas envolventes de piscinas.',
      shortDescription: 'Pavimento cerâmico antiderrapante R11 para exteriores e áreas de alto tráfego.',
      price: 12500, // Preço por m²
      unit: 'm²',
      isPerSquareMeter: true,
      isAvailable: true,
      isFeatured: false,
      dimensions: '60 x 60 cm (Espessura 9 mm)',
      technicalSpecs: JSON.stringify({
        'Superfície': 'Mate Texturada Antiderrapante R11',
        'Resistência ao Desgaste': 'PEI 5 (Tráfego Intenso)',
        'Aplicação': 'Exterior, Varandas, Terraços, Garagens'
      }),
      images: {
        create: tijoleirasImages.slice(3, 6).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Tijoleira Rústica Antiderrapante - Foto ${idx + 1}`
        }))
      }
    }
  });

  // --- 10. Produtos Reais: Torneiras ---
  const torneirasImages = getImagesForCategory('torneiras');
  await prisma.product.create({
    data: {
      name: 'Misturadora Monocomando Lavatório Preto Mate Atlas Elegance',
      slug: 'misturadora-monocomando-lavatorio-preto-mate',
      sku: 'ATL-TOR-001',
      categoryId: catTorneiras.id,
      brandId: brandHydro.id,
      description: 'Misturadora monocomando com acabamento eletrostático preto mate resistente a impressões digitais e corrosão. Equipada com cartucho cerâmico Sedal de 35mm e arejador ecológico Neoperl com redução de consumo de água de até 40%.',
      shortDescription: 'Torneira monocomando em preto mate com cartucho cerâmico e arejador economizador.',
      price: 32000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: true,
      dimensions: 'Altura 175 mm x Projeção 130 mm',
      technicalSpecs: JSON.stringify({
        'Material': 'Latão Maciço Sem Chumbo (Lead-Free Brass)',
        'Acabamento': 'Preto Mate Eletrostático de Alta Resistência',
        'Cartucho': 'Cerâmico Sedal 35mm testado para 500.000 ciclos',
        'Pressão Recomendada': '1.5 a 5.0 Bar',
        'Acessórios Incluídos': '2 Bichas flexíveis de 50cm em aço inoxidável e kit de fixação'
      }),
      images: {
        create: torneirasImages.slice(0, 5).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Misturadora Monocomando Preto Mate - Foto ${idx + 1}`
        }))
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'Misturadora Termostática de Duche Cromada Atlas HydroPro',
      slug: 'misturadora-termostatica-duche-cromada-hydropro',
      sku: 'ATL-TOR-002',
      categoryId: catTorneiras.id,
      brandId: brandHydro.id,
      description: 'Sistema de duche termostático com bloqueio de segurança anti-queimaduras a 38°C, corpo frio isolado (CoolTouch) e acabamento cromado espelhado multicamadas StarShine.',
      shortDescription: 'Coluna e misturadora termostática cromada com botão de segurança 38°C.',
      price: 68000,
      unit: 'un',
      isPerSquareMeter: false,
      isAvailable: true,
      isFeatured: true,
      dimensions: 'Distância entre eixos 150 ± 15 mm',
      technicalSpecs: JSON.stringify({
        'Material': 'Latão Cromado de Alta Pureza',
        'Segurança': 'Trava de segurança 38°C anti-escaldão',
        'Conexões': 'G 1/2 Standard Universal',
        'Acabamento': 'Cromagem de 3 camadas com alta resistência ao calcário'
      }),
      images: {
        create: torneirasImages.slice(5, 10).map((img, idx) => ({
          imageUrl: img.webpPath,
          isPrimary: idx === 0,
          orderIndex: idx,
          altText: `Misturadora Termostática Cromada - Foto ${idx + 1}`
        }))
      }
    }
  });

  console.log('✓ Catálogo de produtos reais e fotografias inseridos');

  // 11. Soluções da Atlas Materials
  await prisma.solution.createMany({
    data: [
      {
        title: 'Materiais de Construção & Estrutura',
        slug: 'materiais-construcao-estrutura',
        icon: 'Building2',
        shortDescription: 'Soluções integrais para fundações, alvenaria, cimentos e materiais brutos para obras de qualquer dimensão.',
        orderIndex: 1,
        isFeatured: true,
      },
      {
        title: 'Acabamentos de Alta Gama & Porcelanatos',
        slug: 'acabamentos-alta-gama',
        icon: 'Sparkles',
        shortDescription: 'Revestimentos, pavimentos retificados e porcelanatos nobres para interiores e exteriores refinados.',
        orderIndex: 2,
        isFeatured: true,
      },
      {
        title: 'Soluções Sanitárias & Banho Completo',
        slug: 'solucoes-sanitarias-banho',
        icon: 'Bath',
        shortDescription: 'Sanitas suspensas, lavatórios de bancada, sistemas de descarga oculta e loiças de máxima higiene.',
        orderIndex: 3,
        isFeatured: true,
      },
      {
        title: 'Portas, Caixilharia & Painéis Decorativos',
        slug: 'portas-caixilharia-paineis',
        icon: 'DoorClosed',
        shortDescription: 'Portas maciças, sistemas acústicos e caixilharia de alumínio com corte térmico de excelência.',
        orderIndex: 4,
        isFeatured: true,
      },
      {
        title: 'Torneiras, Misturadoras & Sistemas Hidráulicos',
        slug: 'torneiras-misturadoras-hidraulica',
        icon: 'Droplets',
        shortDescription: 'Tecnologia de ponta em cartuchos cerâmicos, acabamentos cromados, dourados e preto mate.',
        orderIndex: 5,
        isFeatured: true,
      },
      {
        title: 'Impermeabilização & Isolamento Técnico',
        slug: 'impermeabilizacao-isolamento',
        icon: 'ShieldCheck',
        shortDescription: 'Membranas, telas asfálticas e produtos químicos técnicos para proteção definitiva contra água e humidade.',
        orderIndex: 6,
        isFeatured: true,
      },
    ],
  });

  // 12. Projetos Realizados
  await prisma.project.createMany({
    data: [
      {
        title: 'Edifício Residencial Miramar Vista',
        slug: 'edificio-residencial-miramar-vista',
        location: 'Miramar, Luanda',
        category: 'Residencial de Luxo',
        date: '2025 / 2026',
        description: 'Fornecimento integral de loiça sanitária suspensa Rimless, misturadoras preto mate e 4.200 m² de porcelanatos Calacatta Gold para 24 apartamentos de tipologia T3 e Penthouse.',
        coverImage: '/uploads/products/tijoleiras/20260915_152845.webp',
        isFeatured: true,
      },
      {
        title: 'Condomínio Quinta do Lago Talatona',
        slug: 'condominio-quinta-do-lago-talatona',
        location: 'Talatona, Luanda',
        category: 'Condomínio Fechado',
        date: '2025',
        description: 'Equipamento completo de 18 moradias unifamiliares com portas maciças em madeira tratada e sistemas sanitários ecológicos.',
        coverImage: '/uploads/products/portas/20260915_153055.webp',
        isFeatured: true,
      },
      {
        title: 'Centro Empresarial Atlas Tower',
        slug: 'centro-empresarial-atlas-tower',
        location: 'Zona Financeira, Luanda',
        category: 'Comercial & Escritórios',
        date: '2024 / 2025',
        description: 'Instalação de pavimentos antiderrapantes de tráfego intenso e misturadoras termostáticas nos blocos de sanitários corporativos.',
        coverImage: '/uploads/products/torneiras/20260914_172639.webp',
        isFeatured: true,
      },
    ],
  });

  console.log('✓ Soluções e Projetos inseridos com sucesso');
  console.log('\n=== SEED CONCLUÍDO COM SUCESSO ===');
}

main()
  .catch((e) => {
    console.error('Erro no Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
