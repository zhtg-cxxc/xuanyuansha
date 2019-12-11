'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'xys',
		connect:true,
		character:{
			xy_yaohan:['male','shen',4,['xy_chewang','xy_chewei']],
			xy_baohan:['male','shen',3,['xy_fengxiong','xy_huaji','xy_xiangwu']],
			xy_banxuan:['male','shen',4,['xy_chenqing','xy_chengjie'],['zhu']],
			xy_xxx:['female','shen',3,['xy_jueshi']],
		},
		characterTitle:{
			xy_yaohan:'#b信奥看小说',	
			xy_baohan:'#r吉祥物',
			xy_banxuan:'#r全民男神qwq',
			xy_xxx:'#g未定',
		},
		characterIntro:{
			xy_yaohan:'于 V 0.1.0 创建',	
			xy_baohan:'于 V 0.1.0 创建',
			xy_banxuan:'于 V 0.1.0 创建',
			xy_xxx:'于 V 0.1.1 创建',
		},
		characterSort:{
			xys:{
				xy_teachers:['xy_banxuan'],
				xy_201906:['xy_baohan','xy_yaohan','xy_xxx'],
				
			},
		},
		skill:{
			xy_chewang:{
				mod:{
					targetEnabled:function(card,player,target,now){
						if(target.isTurnedOver()){
							if(!(card.name=='sha'||card.name=='tao'||card.name=='jiu'||card.name=='juedou')) return false;
						}
					}
				},
			},
			xy_chewei:{
				audio:'jushou',
				trigger:{player:'phaseJieshuBegin'},
				content:function(){
					'step 0'
					player.draw(3);
					'step 1'
					player.chooseCard('h',true,'请选择一张手牌并弃置之，若你选择了一张装备牌则改为装备之。').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&!player.isDisabled(get.subtype(result.cards[0]))){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
					'step 3'
					player.turnOver();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			xy_fengxiong:{
				marktext:"凶",
				init:function(player,skill){
					if(!player.storage[skill]) player.storage[skill]=0;
				},
				intro:{
					content:'逢凶同舟共济，化吉有难同当。',
				},
				mark:true,
				audio:'nzry_huaiju',
				trigger:{
					player:['damageBegin'],
				},
				filter:function(event,player){
					return !event.tachibanaed1;
				},
				content:function(){
					trigger.tachibanaed1=true;
					trigger.cancel();
					player.storage.xy_fengxiong+=trigger.num;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					game.log(player,'将伤害转化为',trigger.num,'枚“凶”标记');
					if (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2)player.useSkill("xy_xiangwu1");
					
					if (trigger.source){
						//if(!trigger.source.storage.xy_fengxiong)trigger.source.storage.xy_fengxiong=0;
						player.line(trigger.source,'green');
						/*trigger.source.storage.xy_fengxiong+=trigger.num;
						trigger.source.syncStorage('xy_fengxiong');
						trigger.source.updateMarks('xy_fengxiong');*/
						if(trigger.source.storage.xy_fengxiong==undefined) trigger.source.storage.xy_fengxiong=0;
						trigger.source.markSkill('xy_fengxiong');
						trigger.source.storage.xy_fengxiong+=trigger.num;
						trigger.source.syncStorage('xy_fengxiong');
						game.log(trigger.source,'因试图对',player,'造成伤害而获得',trigger.num,'枚“凶”标记');
						
						if (trigger.source.storage.xy_fengxiong && trigger.source.storage.xy_fengxiong>=2)trigger.source.useSkill("xy_xiangwu1");
					}
				},
			},
			xy_huaji:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				filter:function(event,player){
					return (player.storage.xy_fengxiong>0);
				},
				content:function(){
					player.storage.xy_fengxiong--;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					player.addTempSkill('xy_huaji1',{player:'phaseBegin'});
				},
			},
			xy_huaji1:{
				marktext:"吉",
				intro:{
					content:'直到你的下回合开始，与你的距离为1的其他角色受到伤害时立即取消之，你与该角色各获得等同于伤害数量的“凶”标记。',
				},
				mark:true,
				audio:'nzry_huaiju',
				trigger:{
					global:['damageBegin'],
				},
				filter:function(event,player){
					return get.distance(player,event.player)<=1&&event.player!=player;
				},
				forced:true,
				content:function(){
					trigger.tachibanaed1=true;
					trigger.cancel();
					player.storage.xy_fengxiong+=trigger.num;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					game.log(player,'将针对',trigger.player,'的伤害转化为',trigger.num,'枚“凶”标记');
					
					player.line(trigger.player,'green');
					if(trigger.player.storage.xy_fengxiong==undefined) trigger.player.storage.xy_fengxiong=0;
					trigger.player.markSkill('xy_fengxiong');
					trigger.player.storage.xy_fengxiong+=trigger.num;
					trigger.player.syncStorage('xy_fengxiong');
					game.log(trigger.player,'在',player,'的庇护下将',trigger.num,'点伤害转换为“凶”标记');
					
					if (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2) player.useSkill("xy_xiangwu1");
					if (trigger.player.storage.xy_fengxiong && trigger.player.storage.xy_fengxiong>=2)trigger.player.useSkill("xy_xiangwu1");
				},
			},
			xy_xiangwu1:{
				filter:function(event,player){
					return (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2);
				},
				content:function(){
					while(player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2){
						player.loseHp();
						player.storage.xy_fengxiong-=2;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
					}
					if(player.storage.xy_fengxiong<=0 && !player.hasSkill("xy_fengxiong")) player.unmarkSkill('xy_fengxiong');
				},
			},
			xy_xiangwu:{
				trigger:{player:['phaseBegin']},
				forced:true,
				filter:function(event,player){
					return player.hp<=Math.floor(player.maxHp/2);
				},
				content:function(){
					if(player.storage.xy_fengxiong){
						player.storage.xy_fengxiong--;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
						player.recover();
					}else{
						player.recover();
						player.storage.xy_fengxiong++;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
					}
				},
			},
			xy_chenqing:{
				audio:2,
				trigger:{global:'dieBefore'},
				filter:function(event,player){return player.maxHp>2&&event.player.maxHp>0&&event.player.hp<=0},
				content:function(){
					'step 0'
					player.loseMaxHp();
					'step 1'
					trigger.cancel();
					trigger.player.discard(trigger.player.getCards('hej'));
					'step 2'
					trigger.player.maxHp = player.maxHp;
					trigger.player.update();
					'step 3'
					if (trigger.player.hp<trigger.player.maxHp) trigger.player.recover(trigger.player.maxHp-trigger.player.hp);
					trigger.player.draw(trigger.player.maxHp+1);
					trigger.player.addSkill('xy_chenqing1');
				},
				check:function(event,player){
					return (player==event.player||0<get.attitude(player,event.player));
				},
			},
			xy_chenqing1:{
				marktext:"警",
				intro:{
					content:'虽然你在一番陈情下逃过一劫，但若你进入濒死状态或受到（失去）足以令你进入濒死状态的伤害（体力），你<strong>直接死亡（跳过濒死和死亡结算）</strong>',
				},
				mark:true,
				trigger:{player:['damageBegin','loseHpBegin']},
				forced:true,
				filter:function(event,player){return event.num&player.hp<=event.num},
				content:function(){
					player.die();
				},
				group:['xy_chenqing2'],
			},
			xy_chenqing2:{
				trigger:{player:['dyingBegin']},
				forced:true,
				content:function(){
					player.die();
				},
			},
			xy_chenqing3:{
				trigger:{player:['dyingAfter']},
				forced:true,
				content:function(){
					trigger.player.addSkill('xy_chenqing1');
					trigger.player.removeSkill('xy_chenqing3');
				},
			},/*
			xy_dongyuan:{
				mark:true,
				marktext:"动",
				intro:{
					function (storage,player){
						if (player.hasSkillI('xy_dongyuan')) return "作为动员者，你不能被动员。";
						if (!player.storage.xy_dongyuan1) return "你已被动员#次。";
						else return "你已被进行过最高动员";
					},
					markcount:function(storage,player){
						if(player.hasSkillI('xy_dongyuan')||player.storage.xy_dongyuan1) return 0;
						return player.storage.xy_dongyuan;
					}
				},
				audio:2,
				enable:'phaseUse',
				filterCard:true,
				usable:1,
				check:function(card){
					return 4-get.value(card)
				},
				filterTarget:function(card,player,target){
					if(target.hasSkillI('xy_dongyuan')) return false;
					if(target.storage.xy_dongyuan1) return false;
					return true;
				},
				content:function(){
					'step 0'
					if(!target.storage.xy_dongyuan){
						target.storage.xy_dongyuan=0;
						target.storage.xy_dongyuan1=false;
					}
					target.storage.xy_dongyuan++;
					target.syncStorage('xy_dongyuan');
					target.updateMarks('xy_dongyuan');
					'step 1'
					if(target.storage.xy_dongyuan>=2){
						var list=[
							'对其造成'+get.translation(target.storage.xy_dongyuan-1)+'点火焰伤害',
							'令其回复'+get.translation(target.storage.xy_dongyuan-1)+'点体力'
						];
						player.chooseControl('对其造成','获得闪').set('prompt','选择一项').set('ai',function(){
							var player=_status.event.player;
							if(player.hasShan()) return 0;
							return 1;
						});
					}
					'step 2'
					if(result.control=='获得杀'){
						player.gain(game.createCard('sha'),'gain2');
					}
					else{
						player.gain(game.createCard('shan'),'gain2');
					}
				},
				ai:{
					order:5.5,
					result:{
						player:function(player){
							if(player.hp<player.maxHp) return 4;
							if(player.countCards('h')>player.hp) return 0
							return -1;
						},
						target:4
					},
					threaten:2,
				}
			},*/
			xy_chengjie:{
				audio:2,
				trigger:{player:'damageEnd'},
				forced:true,
				zhuSkill:true,
				filter:function(event,player){
					return (event.source&&event.num>0&&event.source!=player&&player.hp<=3);
				},
				content:function(){
					trigger.source.storage.xy_chengjie = Math.min(4-player.hp,3);
					trigger.source.addTempSkill('xy_chengjie2',{player:'phaseEnd'});
					if(!trigger.source.hasSkill('fengyin')&&trigger.source.storage.xy_chengjie>=2){
						trigger.source.addTempSkill('fengyin');
					}
				}
			},
			xy_chengjie2:{
				mark:true,
				mod:{
					cardEnabled:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardUsable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardRespondable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardSavable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
				},
				intro:{
					content:function(storage,player){
						var s = "直到你的回合结束：<ul>";
						if(player.storage.xy_chengjie>=1) s = s + "<li>你不能使用或打出【杀】</li>";
						if(player.storage.xy_chengjie>=2) s = s + "<li>你的非锁定技失效</li>";
						if(player.storage.xy_chengjie>=3) s = s + "<li>你不能使用或打出除了红桃牌以外的手牌</li>";
						s = s + "</ul>";
						return s;
					}
				}
			},
			xy_jueshi:{
				audio:'xy_jueshi1',
				audioname:['xiahouba'],
				group:['xy_jueshi1','xy_jueshi2','xy_jueshi4']
			},
			xy_jueshi1:{
				audio:2,
				audioname:['xiahouba'],
				trigger:{player:'phaseJudgeBefore'},
				direct:true,
				content:function(){
					"step 0"
					var check= player.countCards('h')>2;
					player.chooseTarget(get.prompt("xy_jueshi"),"跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】",function(card,player,target){
						if(player==target) return false;
						return player.canUse({name:'sha'},target,false);
					}).set('check',check).set('ai',function(target){
						if(!_status.event.check) return 0;
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_jueshi1',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
						trigger.cancel();
						player.skip('phaseDraw');
					}
				}
			},
			xy_jueshi2:{
				audio:'xy_jueshi1',
				audioname:['xiahouba'],
				trigger:{player:'phaseUseBefore'},
				direct:true,
				filter:function(event,player){
					return player.countCards('he',{type:'equip'})>0;
				},
				content:function(){
					"step 0"
					var check=player.needsToDiscard();
					player.chooseCardTarget({
						prompt:get.prompt('xy_jueshi'),
						prompt2:"弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
						filterCard:function(card,player){
							return get.type(card)=='equip'&&lib.filter.cardDiscardable(card,player)
						},
						position:'he',
						filterTarget:function(card,player,target){
							if(player==target) return false;
							return player.canUse({name:'sha'},target,false);
						},
						ai1:function(card){
							if(_status.event.check) return 0;
							return 6-get.value(card);
						},
						ai2:function(target){
							if(_status.event.check) return 0;
							return get.effect(target,{name:'sha'},_status.event.player);
						},
						check:check
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_jueshi2',result.targets);
						player.discard(result.cards[0]);
						player.useCard({name:'sha'},result.targets[0]);
						trigger.cancel();
					}
				}
			},
			xy_jueshi4:{
				audio:'xy_jueshi1',
				audioname:['xiahouba'],
				trigger:{player:'phaseDiscardBefore'},
				direct:true,
				content:function(){
					"step 0"
					var check=player.needsToDiscard()||player.isTurnedOver();
					player.chooseTarget(get.prompt('xy_jueshi'),"跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】",function(card,player,target){
						if(player==target) return false;
						return player.canUse({name:'sha'},target,false);
					}).set('check',check).set('ai',function(target){
						if(!_status.event.check) return 0;
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_jueshi4',result.targets);
						player.turnOver();
						player.useCard({name:'sha'},result.targets[0],false);
						trigger.cancel();
					}
				}
			},
			
		},
		translate:{
			xy_yaohan:"姚涵",
			xy_baohan:"包涵",
			xy_banxuan:"班轩",
			xy_xxx:"未定",

			xy_teachers:'教职工',
			xy_201906:'轩辕六班',
			
			xy_chewang:"车王",
			xy_chewang_info:"<strong>锁定技</strong>，你处于翻面状态时，除了【杀】、【决斗】、【桃】、【酒】以外，你不能被牌指定为目标。",
			xy_chewei:"车位",
			xy_chewei_info:"结束阶段，你可以获得三张牌并弃置一张手牌，若你选择了一张装备牌，则改为使用之，然后你将你的武将牌翻面。",
			xy_fengxiong:"逢凶",
			xy_fengxiong_info:"每当你受到伤害时，你可以取消之，然后你与伤害来源（如果有）各获得等同于伤害数量的“凶”标记。",
			xy_huaji:"化吉",
			xy_huaji1:"化吉",
			xy_huaji_info:"你的回合结束时，若你有“凶”标记，你可以弃置一枚“凶”标记，然后直到你的下回合开始，与你的距离为1的其他角色受到伤害时立即取消之，你与该角色各获得等同于伤害数量的“凶”标记。",
			xy_xiangwu:"祥物",
			xy_xiangwu1:"祥物",
			xy_xiangwu_info:"<strong>锁定技</strong>，每当场上有角色拥有两枚及以上的“凶”，其须弃置两张“凶”并流失一点体力，然后重复此流程，直到其“凶”的数量在两枚以下；开始阶段，若你的体力值不高于体力上限的一半（向上取整），你可以弃置一枚“凶”标记并获得一点体力（有“凶”标记）或获得一点体力并获得一枚“凶”标记（没有“凶”标记）。",
			xy_chenqing:"陈情",
			xy_chenqing1:"下不为例",
			xy_chenqing2:"下不为例",
			xy_chenqing3:"下不为例",
			xy_chenqing_info:"每当一名角色开始进行死亡结算时，若你的体力上限大于2，则你可以另你的体力上限-1，然后取消其死亡结算并弃置其区域内所有牌，令其体力值及体力上限均等于你的体力上限，然后摸等同其体力上限+1的牌，并获得“警”标志（若其进入濒死状态或受到（失去）足以令其进入濒死状态的伤害（体力），其<strong>直接死亡（跳过濒死和死亡结算）</strong>）。",
			xy_chengjie:"惩戒",
			xy_chengjie2:"惩戒",
			xy_chengjie_info:"<strong>主公技，锁定技</strong>，每当你受到其他角色的伤害时，伤害来源根据你的体力值获得如下效果直到该角色的结束阶段：<br/>≤3：不能使用【杀】；<br/>≤2：非锁定技失效；<br/>≤1：无法使用除红桃牌以外的手牌。",
			xy_jueshi:"绝食",
			xy_jueshi1:"绝食",
			xy_jueshi2:"绝食",
			xy_jueshi4:"绝食",
			xy_jueshi_info:'你可以选择一至三项：1. 跳过判定阶段和摸牌阶段；2. 跳过出牌阶段并弃置一张装备牌；3. 跳过弃牌阶段并将你的武将牌翻面。你每选择一项，视为你对一名其他角色使用一张没有距离限制的【杀】',
		},
	};
});
