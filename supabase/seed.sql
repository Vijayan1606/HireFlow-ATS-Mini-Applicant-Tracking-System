-- ==============================================================================
-- HireFlow ATS - Supabase Sample Seed Data
-- 15 Realistic Candidates distributed across all 5 recruitment stages
-- ==============================================================================

INSERT INTO public.candidates (full_name, email, phone, position, skills, experience_years, resume_url, stage, notes, applied_at)
VALUES
    (
        'Alexandra Chen',
        'alexandra.chen@techmail.io',
        '+1 (415) 890-1234',
        'Senior Full Stack Engineer',
        ARRAY['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
        7,
        'https://github.com/alexandrachen',
        'Interview',
        'Strong system design background at Series B startup. Impressed in technical round on distributed caching.',
        NOW() - INTERVAL '4 days'
    ),
    (
        'Marcus Vance',
        'm.vance@workhub.dev',
        '+1 (512) 441-8902',
        'AI / ML Engineer',
        ARRAY['Python', 'FastAPI', 'PyTorch', 'Docker', 'AWS'],
        5,
        'https://linkedin.com/in/marcus-vance',
        'Offer',
        'Exceptional evaluation score in LLM orchestration and rag architectures. Offer extended for 165k base + equity.',
        NOW() - INTERVAL '12 days'
    ),
    (
        'Priya Sharma',
        'priya.sharma@cloudlabs.net',
        '+1 (206) 555-7819',
        'Product Designer (UI/UX)',
        ARRAY['Figma', 'Design Systems', 'Tailwind CSS', 'Prototyping', 'User Research'],
        4.5,
        'https://priyasharma.design',
        'Screening',
        'Portfolio features clean B2B SaaS interfaces. Scheduling first conversation with Head of Product.',
        NOW() - INTERVAL '2 days'
    ),
    (
        'David Kowalski',
        'david.k@codenest.com',
        '+1 (312) 998-3412',
        'DevOps & Cloud Specialist',
        ARRAY['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD'],
        6,
        'https://github.com/dkowalski-ops',
        'Hired',
        'Accepted offer! Start date set for first Monday of next month. Background check cleared.',
        NOW() - INTERVAL '22 days'
    ),
    (
        'Sophia Martinez',
        'sophia.martinez@bytecraft.org',
        '+1 (650) 332-9011',
        'Frontend Engineer',
        ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'],
        3,
        'https://sophiamartinez.dev',
        'Applied',
        'Recent applicant through LinkedIn Careers. Experience at modern e-commerce agency.',
        NOW() - INTERVAL '1 day'
    ),
    (
        'Ethan Reynolds',
        'e.reynolds@fintechpros.io',
        '+1 (415) 771-4509',
        'Backend Engineer',
        ARRAY['Go', 'PostgreSQL', 'Redis', 'Docker', 'Kafka'],
        8,
        'https://github.com/ereynolds-go',
        'Interview',
        'Completed hiring manager call. Scheduling architecture deep dive with staff engineer.',
        NOW() - INTERVAL '6 days'
    ),
    (
        'Nadia Al-Mansoor',
        'nadia.mansoor@talentpulse.com',
        '+1 (646) 402-8812',
        'Product Manager',
        ARRAY['Agile', 'Jira', 'SQL', 'Data Analytics', 'User Research'],
        5,
        'https://linkedin.com/in/nadia-mansoor',
        'Screening',
        'Recruiter phone screen scheduled for tomorrow at 2 PM EST.',
        NOW() - INTERVAL '3 days'
    ),
    (
        'Liam O''Connor',
        'liam.oconnor@dublintech.ie',
        '+353 1 496 0123',
        'Senior Full Stack Engineer',
        ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase'],
        9,
        'https://github.com/liam-oc',
        'Offer',
        'Unanimous team recommendation. Final compensation package currently with candidate for review.',
        NOW() - INTERVAL '15 days'
    ),
    (
        'Hannah Schmidt',
        'hannah.schmidt@berlincode.de',
        '+49 30 2219980',
        'QA Automation Engineer',
        ARRAY['Playwright', 'Cypress', 'TypeScript', 'CI/CD', 'Jest'],
        4,
        'https://github.com/hannah-schmidt-qa',
        'Hired',
        'Signed contract! Welcome kit sent, onboarding meetings prepared.',
        NOW() - INTERVAL '28 days'
    ),
    (
        'Jordan Taylor',
        'jordan.t@apexstudio.io',
        '+1 (408) 612-4491',
        'Frontend Engineer',
        ARRAY['React', 'Vue', 'JavaScript', 'Tailwind CSS', 'CSS3'],
        2.5,
        'https://jordantaylor.me',
        'Applied',
        'Application submitted via referral from Sarah in Growth.',
        NOW() - INTERVAL '1 day'
    ),
    (
        'Dr. Rajesh Pillai',
        'r.pillai@quantinsights.ai',
        '+1 (858) 554-3200',
        'AI / ML Engineer',
        ARRAY['Python', 'TensorFlow', 'NLP', 'Vector Databases', 'LangChain'],
        6.5,
        'https://scholar.google.com/citations?user=sample',
        'Interview',
        'Presented fascinating case study on agentic memory models. Technical score 9.5/10.',
        NOW() - INTERVAL '8 days'
    ),
    (
        'Camila Rodriguez',
        'camila.rodriguez@latamdev.com',
        '+52 55 5280 1900',
        'Backend Engineer',
        ARRAY['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
        4,
        'https://github.com/camilarodriguez',
        'Screening',
        'Passed initial resume review with high match on Python microservices experience.',
        NOW() - INTERVAL '4 days'
    ),
    (
        'Julian Banks',
        'julian.banks@venturestack.co',
        '+1 (212) 983-1122',
        'Product Designer (UI/UX)',
        ARRAY['Figma', 'Design Systems', 'Mobile Design', 'User Testing'],
        7,
        'https://julianbanks.work',
        'Applied',
        'Applied yesterday. Strong visual craft and case studies in SaaS dashboards.',
        NOW() - INTERVAL '2 hours'
    ),
    (
        'Kavita Nair',
        'kavita.nair@innovatetech.in',
        '+91 98200 12345',
        'Senior Full Stack Engineer',
        ARRAY['Next.js', 'React', 'Node.js', 'GraphQL', 'AWS'],
        6,
        'https://linkedin.com/in/kavita-nair-dev',
        'Interview',
        'Panel interview scheduled for Friday morning.',
        NOW() - INTERVAL '5 days'
    ),
    (
        'Lucas Bennett',
        'lucas.bennett@nordicdev.se',
        '+46 8 123 4567',
        'DevOps & Cloud Specialist',
        ARRAY['Terraform', 'Kubernetes', 'GCP', 'Prometheus', 'Grafana'],
        5,
        'https://github.com/lucasbennett',
        'Offer',
        'Verbal offer accepted, preparing official written documentation.',
        NOW() - INTERVAL '10 days'
    )
ON CONFLICT (email) DO NOTHING;
